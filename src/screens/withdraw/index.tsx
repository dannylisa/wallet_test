import { Box, fontfaces, HeaderBase, PADDING_HORIZONTAL, screenStyles, TextInput, Typography } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import { myWalletsState } from "@/modules/my-wallets.atom";
import { fAddress } from "@/utils/format-address";
import { web3 } from "@/web3-config";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, View } from "react-native";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import { useRecoilValue } from "recoil";
import Web3 from "web3";


export function Withdraw(){
    const currentWallet = useRecoilValue(currentWalletState)
    const myWallets = useRecoilValue(myWalletsState)

    // 보내는 지갑
    const [senderDropdownOpen, setSenderDropdownOpen] = useState(false);
    const [senderWalletAddress, setSenderWalletAddress] = useState<ValueType | null>(currentWallet?.address || null)
    const walletsItem = useMemo(() => myWallets.map(({address}, i) => ({
        label: `Account ${i+1}  ${fAddress(address)}`,
        value: address
    })), [myWallets])
    const [senderWalletBalance, setSenderWalletBalance] = useState<string>("-")
    const onChangeSenderAddress = () => {
        setSenderWalletBalance("-")
    }
    useEffect(() => {
        if(!senderWalletAddress)
            return;
        web3.eth
            .getBalance(""+senderWalletAddress)
            .then(res => {
                const eth = Web3.utils.fromWei(res, 'ether')
                setSenderWalletBalance(eth)
            })
    },[senderWalletAddress])


    // 받는 지갑
    const [receiverAddress, setReceiverAddress] = useState<string>("")

    
    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
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
                    marginBottom={6}
                />
                <DropDownPicker
                    open={senderDropdownOpen}
                    setOpen={setSenderDropdownOpen}
                    value={senderWalletAddress}
                    setValue={setSenderWalletAddress}
                    onChangeValue={onChangeSenderAddress}
                    items={walletsItem}
                />
                <Box marginTop={12} justifyContent="space-between">
                    <Typography 
                        bold
                        style={fontfaces.P1}
                        children="잔고"
                        marginBottom={6}
                    />
                    <Typography 
                        bold
                        style={fontfaces.P1}
                        children={`${senderWalletBalance}`}
                        marginBottom={6}
                    />
                </Box>


                {/* 받는 지갑 */}
                <Typography 
                    bold
                    style={fontfaces.P1}
                    children="받는 지갑"
                    marginTop={12}
                    marginBottom={6}
                />
                <TextInput 
                    value={receiverAddress}
                    onChangeText={setReceiverAddress}
                />
            </View>
        </SafeAreaView>

    )
}