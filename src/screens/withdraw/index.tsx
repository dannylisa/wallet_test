import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, fontfaces, HeaderBase, PADDING_HORIZONTAL, screenStyles, TextInput, Typography } from "@/materials";
import { Alert, Keyboard, SafeAreaView, View } from "react-native";
import { currentWalletState } from "@/modules/current-wallet.atom";
import { myWalletsState } from "@/modules/my-wallets.atom";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import { useRecoilValue } from "recoil";
import { getKeychainItem } from "@/utils/secure-key-store";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { MyWalletsBottomSheet } from "./mywallet-bottom-sheet";
import { fAddress } from "@/utils/format-address";
import Web3 from "web3";
import { ropsten } from "@/web3-config";
import { StackNavigationProp } from "@react-navigation/stack";
import { WithdrawParamList } from "@/navigation/bottom-tab/WithdrawNavigator";
import { useNavigation } from "@react-navigation/native";
import { useCurrentTransaction } from "@/modules/current-transaction";
import { ITransaction } from "@/interface/transaction.interface";
import Toast, { ErrorToast } from "react-native-toast-message";



const {toBN, toWei, fromWei, isAddress} = Web3.utils
const GweiToEther = (gwei: string | number) => fromWei(toWei(gwei+"", 'Gwei'), 'ether')

type WithdrawScreenProp = StackNavigationProp<WithdrawParamList, "withdraw/main">


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
    useEffect(() => {
        if(!fromAddress)
            return;
        ropsten.eth
            .getBalance(""+fromAddress)
            .then(res => {
                const eth = fromWei(res, 'ether')
                setFromBalance(eth)
            })
    },[fromAddress])


    // 받는 지갑
    const [toAddress, setToAddress] = useState<string>("")
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const openToAddressModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
        Keyboard.dismiss()
    }, []);

    // 금액
    const [valueETH, setValueETH] = useState<string>("")
    const [gasPrice, setGasPrice] = useState<number>(0)
    const [gasLimit, setGasLimit] = useState<number>(0)
    const gasFee = useMemo(() => gasLimit*gasPrice, [gasLimit, gasPrice])
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
        if(fromAddress && toAddress && valueETH)
            ropsten.eth.estimateGas({
                from: fromAddress+"",
                to: toAddress,
                value: toWei(valueETH, 'ether')
            }, (err, gas) => {
                console.log(gas)
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
            value
        })
        
        const nonce = await ropsten.eth.getTransactionCount(from);
        const privateKey = await getKeychainItem(from)
        if(!privateKey){
            Alert.alert('로컬에 개인 키가 저장되어있지 않습니다.')
            return;
        }

        const tx:ITransaction ={
            from,
            to: toAddress,
            nonce,
            value,
            gasPrice,
            gasLimit
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
                    .once('confirmation', () => changeTransactionStatus(txID, 'confirmation'))
                    .once('error', () => {
                        setTerminalTransaction(txID, 'error')
                        ErrorToast({
                            text1: '송금 요청에 실패하였습니다.'
                        })
                    })
                    .once(
                        'receipt', 
                        (receipt)=> {
                            setTerminalTransaction(txID, 'receipt');
                            Toast.show({
                                type: 'success',
                                text1: `${value} ETH 송금이 완료되었습니다.`,
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
                    <Box 
                        flexDirection="row"
                        marginTop={12} 
                        justifyContent="space-between"
                    >
                        <Typography 
                            style={fontfaces.D1}
                            children="잔고"
                            marginBottom={12}
                        />
                        <Typography 
                            bold
                            style={fontfaces.D1}
                            children={`${fromBalance} ETH`}
                            marginBottom={6}
                        />
                    </Box>


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
                
                    {/* 금액 */}
                    <Typography 
                        bold
                        style={fontfaces.P1}
                        children="보낼 금액"
                        marginVertical={12}
                    />
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
                                children="ETH"
                                marginLeft={12}
                                marginTop={6}
                            />
                        }
                    />


                    <Box 
                        flexDirection="row"
                        justifyContent="space-between" 
                        alignItems="center" 
                        marginVertical={12}
                    >
                        <Typography 
                            bold
                            style={fontfaces.P1}
                            children="가스 비용"
                        />
                        <Typography 
                            bold
                            style={fontfaces.P1}
                            children={`${gasFee} ETH`}
                        />
                    </Box>
                    <Button type="primary" onPress={makeTX}>
                        보내기
                    </Button>

                </View>


                <MyWalletsBottomSheet 
                    sheetRef={bottomSheetModalRef} 
                    onSelect={setToAddress}
                />
            </BottomSheetModalProvider>
        </SafeAreaView>

    )
}