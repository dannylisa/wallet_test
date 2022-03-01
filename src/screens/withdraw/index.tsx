import { Box, fontfaces, HeaderBase, PADDING_HORIZONTAL, screenStyles, shadow, TextInput, Typography } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import { myWalletsState } from "@/modules/my-wallets.atom";
import { fAddress } from "@/utils/format-address";
import { ropsten } from "@/web3-config";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import { useRecoilValue } from "recoil";
import Web3 from "web3";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { MyWalletsBottomSheet } from "./mywallet-bottom-sheet";
import { getKeychainItem } from "@/utils/secure-key-store";


export function Withdraw(){
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
                const eth = Web3.utils.fromWei(res, 'ether')
                setFromBalance(eth)
            })
    },[fromAddress])


    // 받는 지갑
    const [toAddress, setToAddress] = useState<string>("")
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const openToAddressModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    // 금액
    const [value, setValue] = useState<string>("")
    // const estimateFee = Web3.utils.toBN()
    // .bigNumberify(gasPrice).mul(gasLimit);

    const makeTX = async () =>{
        if(!fromAddress)
            return;

        const gasPrice = '0';
        const gasLimit = '0';
        const nonce = await ropsten.eth.getTransactionCount(fromAddress+"");

        const tx = {
            to: toAddress,
            value: Web3.utils.toWei(value, 'ether'), // ehter => wei 
            gasPrice: Web3.utils.toWei(gasPrice, 'gwei'), // gwei => wei
            gasLimit: Web3.utils.toBN(gasLimit), 
            nonce: nonce,
            data: ''
        }
    }

    useEffect(() => {
        if(currentWallet)
            getKeychainItem(currentWallet.address).then(res => console.log(res))
    },[])
    
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
                        validator={Web3.utils.isAddress}
                        message="올바른 지갑 주소가 아닙니다."
                    />
                
                    {/* 금액 */}
                    <Typography 
                        bold
                        style={fontfaces.P1}
                        children="금액"
                        marginVertical={12}
                    />
                    <Box flexDirection="row">
                        <TextInput
                            keyboardType="numeric" 
                            value={value}
                            onChangeText={setValue}
                            placeholder="보낼 금액을 입력해 주세요."
                            validator={Web3.utils.isAddress}
                            message="올바른 지갑 주소가 아닙니다."
                        />
                    </Box>
                
                
                </View>


                <MyWalletsBottomSheet 
                    sheetRef={bottomSheetModalRef} 
                    onSelect={setToAddress}
                />
            </BottomSheetModalProvider>
        </SafeAreaView>

    )
}