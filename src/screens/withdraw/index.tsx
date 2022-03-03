import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, fontfaces, HeaderBase, PADDING_HORIZONTAL, screenStyles, TextInput, Typography } from "@/materials";
import { Alert, Keyboard, SafeAreaView, View } from "react-native";
import { currentWalletState } from "@/modules/current-wallet.atom";
import { myWalletsState } from "@/modules/my-wallets.atom";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import { useRecoilValue } from "recoil";
import { getKeychainItem } from "@/utils/secure-key-store";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ERCTokensBottomSheet } from "./erc-tokens-bottom-sheet";
import { fAddress } from "@/utils/format-address";
import Web3 from "web3";
import { ropsten } from "@/web3-config";
import { StackNavigationProp } from "@react-navigation/stack";
import { WithdrawParamList } from "@/navigation/bottom-tab/WithdrawNavigator";
import { useNavigation } from "@react-navigation/native";
import { useCurrentTransaction } from "@/modules/current-transaction";
import { ITransaction } from "@/interface/transaction.interface";
import Toast, { ErrorToast } from "react-native-toast-message";
import { MyWalletsBottomSheet } from "./mywallet-bottom-sheet copy";
import { minAbi } from "@/utils/erc20-abi";
import { TransactionReceipt } from 'web3-core'


const {toBN, toWei, fromWei, isAddress} = Web3.utils
const GweiToEther = (gwei: string | number) => fromWei(toWei(gwei+"", 'Gwei'), 'ether')

type WithdrawScreenProp = StackNavigationProp<WithdrawParamList, "withdraw/main">

interface Token {
    symbol: string
    address: string | null
}

export function Withdraw(){
    const nav = useNavigation<WithdrawScreenProp>()


    const currentWallet = useRecoilValue(currentWalletState)
    const myWallets = useRecoilValue(myWalletsState)

    // 보내는 지갑
    const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
    const [fromAddress, setFromAddress] = useState<ValueType | null>(currentWallet?.address || null)
    const myWalletsItem = useMemo(() => myWallets.map(({address}, i) => ({
        label: `Account ${i+1}  ${fAddress(address, 16)}`,
        value: address
    })), [myWallets])
    const [fromBalance, setFromBalance] = useState<string>("-")
    const onChangeFromAddress = () => {
        setFromBalance("-")
    }

    // 토큰 사용여부, null -> 이더리움
    const [token, setToken] = useState<Token>({symbol: "ETH", address: null})
    const ercTokenBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const openErcTokenModal = useCallback(() => {
        ercTokenBottomSheetModalRef.current?.present();
        Keyboard.dismiss()
    }, []);

    useEffect(() => {
        if(!fromAddress)
            return;

        if(token.address){

            const contract = new ropsten.eth.Contract(minAbi, token.address);
            contract.methods
                .balanceOf(fromAddress+"")
                .call()
                .then((bal: string) => setFromBalance(Web3.utils.fromWei(bal)))

        } else {
            ropsten.eth
                .getBalance(""+fromAddress)
                .then(res => {
                    const eth = fromWei(res, 'ether')
                    setFromBalance(eth)
                })
        }
    },[fromAddress, token.address])


    // 받는 지갑
    const [toAddress, setToAddress] = useState<string>("")
    const toAddressBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const openToAddressModal = useCallback(() => {
        toAddressBottomSheetModalRef.current?.present();
        Keyboard.dismiss()
    }, []);


    // 금액
    const [valueETH, setValueETH] = useState<string>("")
    const [gasPrice, setGasPrice] = useState<number>(0)
    const [gasLimit, setGasLimit] = useState<number>(0)
    const gasFee = useMemo(() => !token.address ? gasLimit*gasPrice : fromWei(toWei("100000", 'gwei')), [gasLimit, gasPrice, token.address])
    const isSendable = (value: string) => {
        if(fromBalance==="-"){
            return false;
        }

        return toBN(toWei(fromBalance, 'ether')).gte(
            toBN(toWei(value, 'ether')).add(
                toBN(parseInt(gasPrice*gasLimit+"e+15"))
            )
        )
    }

    // 현재 트랜잭션 관리
    const {
        addTransaction, 
        changeTransactionStatus, 
        setTransactionHash,
        setTerminalTransaction
    } = useCurrentTransaction()

    // 마지막 블록의 gas의 median
    useEffect(() => {
        ropsten.eth.getGasPrice().then((gas) => {
            setGasPrice(+fromWei(gas, 'Gwei'))
        })
    },[])

    // Estimate Gas Limit
    useEffect(() => {
        if(token.address)
            setGasLimit(0)
        else if(fromAddress && toAddress && valueETH)
            ropsten.eth.estimateGas({
                from: fromAddress+"",
                to: toAddress,
                value: toWei(valueETH, 'ether')
            }, (err, gas) => {
                setGasLimit(+GweiToEther(gas || 0))
            })
    },[fromAddress, toAddress, valueETH])

    const makeTX = async () =>{
        if(!fromAddress)
            return;
        const from = fromAddress+""
        const value = toWei(valueETH, 'ether')

        const gasPrice = await ropsten.eth.getGasPrice()

        const gasLimit = await ropsten.eth.estimateGas({
            from,
            to: toAddress,
            value: token.address ? 0 : value
        })
        
        const nonce = await ropsten.eth.getTransactionCount(from);

        const tx:ITransaction ={
            from,
            to: toAddress,
            nonce,
            value,
            gasPrice,
            gasLimit,
        }

        const privateKey = await getKeychainItem(from)
        if(!privateKey){
            Alert.alert('로컬에 개인 키가 저장되어있지 않습니다.')
            return;
        }


        // ERC token의 경우
        if(token.address){
            const txID = Math.floor(new Date().getTime()/1000)

            ropsten.eth.accounts.wallet.add(privateKey)
            const contract = new ropsten.eth.Contract(minAbi, token.address);

            contract.methods
                .transfer(toAddress, value)
                .send({
                    from,
                    gasPrice,
                    gas: 100000
                })
                .once('sending', () => addTransaction(txID, {...tx, symbol: token.symbol}))
                .once('sent', () => changeTransactionStatus(txID, 'sent'))
                .once('transactionHash', (hash: string) => setTransactionHash(txID, hash))
                .once('confirmation', () => setTerminalTransaction(txID, 'confirmation'))
                .once('error', () => {
                    setTerminalTransaction(txID, 'error')
                    ErrorToast({
                        text1: '송금 요청에 실패하였습니다.'
                    })
                })
                .once(
                    'receipt', 
                    (receipt:TransactionReceipt)=> {
                        Toast.show({
                            type: 'success',
                            text1: `${fromWei(value)} ${token.symbol} 송금이 완료되었습니다.`,
                            text2: `${fAddress(tx.from)} -> ${fAddress(tx.to)}`,
                            onPress: () => nav.navigate('withdraw/receipt', {receipt}) 
                        });
                    }
                )
                nav.navigate('withdraw/requested') 

            return;
        }

        await ropsten.eth.accounts.signTransaction(tx, privateKey,
            (err, signedTransaction) => {
                if(err){
                    ErrorToast({
                        text1: '요청에 실패하였습니다.'
                    })
                }
                if(signedTransaction.rawTransaction){
                    // local ID
                    const txID = Math.floor(new Date().getTime()/1000)

                    ropsten.eth.sendSignedTransaction(
                        signedTransaction.rawTransaction
                    )
                    .once('sending', () => addTransaction(txID, tx))
                    .once('sent', () => changeTransactionStatus(txID, 'sent'))
                    .once('transactionHash', (hash) => setTransactionHash(txID, hash))
                    .once('confirmation', () => setTerminalTransaction(txID, 'confirmation'))
                    .once('error', () => {
                        setTerminalTransaction(txID, 'error')
                        ErrorToast({
                            text1: '송금 요청에 실패하였습니다.'
                        })
                    })
                    .once(
                        'receipt', 
                        (receipt)=> {
                            Toast.show({
                                type: 'success',
                                text1: `${fromWei(value)} ETH 송금이 완료되었습니다.`,
                                text2: `${fAddress(tx.from)} -> ${fAddress(tx.to)}`,
                                onPress: () => nav.navigate('withdraw/receipt', {receipt}) 
                            });
                        }
                    )
                    nav.navigate('withdraw/requested') 
                }
            })
    }

    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <BottomSheetModalProvider>
                <HeaderBase style={{justifyContent: "center"}} >
                    <Typography 
                        style={fontfaces.P1}
                        bold
                        children="출금"
                    />
                </HeaderBase>

                <View style={[screenStyles.defaultScreen, {padding: PADDING_HORIZONTAL}]} >
                    {/* 보내는 지갑 */}
                    <Typography 
                        bold
                        style={fontfaces.P1}
                        children="보내는 지갑"
                        marginBottom={12}
                    />
                    <DropDownPicker
                        open={fromDropdownOpen}
                        setOpen={setFromDropdownOpen}
                        value={fromAddress}
                        setValue={setFromAddress}
                        onChangeValue={onChangeFromAddress}
                        items={myWalletsItem}
                    />


                    {/* 받는 지갑 */}
                    <Box 
                        flexDirection="row"
                        justifyContent="space-between" 
                        alignItems="center" 
                        marginVertical={12}
                    >
                        <Typography 
                            bold
                            style={fontfaces.P1}
                            children="받는 지갑"
                        />
                        <Typography 
                            color="primary"
                            style={fontfaces.D1}
                            children="내 지갑으로 보내기"
                            onPress={openToAddressModal}
                        />
                    </Box>
                    <TextInput 
                        value={toAddress}
                        onChangeText={setToAddress}
                        placeholder="받는 지갑 주소를 입력해 주세요."
                        validator={isAddress}
                        message="올바른 지갑 주소가 아닙니다."
                    />
                
                    {/* 보낼 금액 */}
                    <Box 
                        flexDirection="row"
                        justifyContent="space-between" 
                        alignItems="center" 
                        marginVertical={12}
                    >
                        <Typography 
                            bold
                            style={fontfaces.P1}
                            children="보낼 금액"
                        />
                        <Typography 
                            color="primary"
                            style={fontfaces.D1}
                            children="다른 토큰 전송하기"
                            onPress={openErcTokenModal}
                        />
                    </Box>
                    <TextInput
                        keyboardType="numeric" 
                        value={valueETH}
                        onChangeText={setValueETH}
                        placeholder="0.5"
                        validator={isSendable}
                        message="잔액이 부족합니다."
                        style={{textAlign: "right"}}
                        Right={
                            <Typography 
                                bold
                                style={fontfaces.P1}
                                children={token.symbol}
                                marginLeft={12}
                                marginTop={6}
                            />
                        }
                    />

                    <Box 
                        flexDirection="row"
                        justifyContent="space-between"
                        marginTop={6}
                    >
                        <Typography 
                            style={fontfaces.P2}
                            children="잔고"
                        />
                        <Typography 
                            style={fontfaces.P2}
                            children={`${fromBalance} ${token.symbol}`}
                        />
                    </Box>


                    <Box 
                        flexDirection="row"
                        justifyContent="space-between" 
                        alignItems="center" 
                        marginTop={4}
                        marginBottom={12}
                    >
                        <Typography 
                            style={fontfaces.P2}
                            children="가스 비용"
                        />
                        <Typography 
                            style={fontfaces.P2}
                            children={`${gasFee} ETH`}
                        />
                    </Box>
                    <Button type="primary" onPress={makeTX}>
                        보내기
                    </Button>

                </View>


                <MyWalletsBottomSheet 
                    sheetRef={toAddressBottomSheetModalRef} 
                    onSelect={setToAddress}
                />
                <ERCTokensBottomSheet
                    sheetRef={ercTokenBottomSheetModalRef} 
                    onSelect={setToken}
                    walletAddress={fromAddress ? fromAddress+"" : ""}
                />
            </BottomSheetModalProvider>
        </SafeAreaView>

    )
}