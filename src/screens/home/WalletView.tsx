import { IStorageWallet } from "@/interface/storage-wallet.interface";
import { Box, fontfaces, shadow, Tag, Typography } from "@/materials";
import { ropsten } from "@/web3-config";
import React, { useEffect, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import Web3 from "web3";

interface WalletViewProps {
    wallet: IStorageWallet
}
export const WalletView = ({wallet:{address, }}:WalletViewProps) => {
    const [balance, setBalance] = useState<string>("-")

    const updateBalance = () => {
        ropsten.eth
            .getBalance(address)
            .then(res => {
                const eth = Web3.utils.fromWei(res, 'ether')
                setBalance(eth)
            })
    }


    useEffect(() => {
        updateBalance()

        // 5초마다 자산 최신화
        const timerId = setInterval(updateBalance, 5000)
        return () => clearInterval(timerId)
    },[])

    return (
        <Box style={[shadow, {borderRadius: 4}]} padding={16}>
            <Box alignItems="flex-start" marginBottom={8}>
                <Typography style={fontfaces.D1} color="blue" children="테스트넷"/>
            </Box>
            <Tag 
                color="green"
                children={address}
            />
            <Box alignItems="center" marginTop={10}  >
                <QRCode 
                    value={address}
                    size={100}
                />
            </Box>
        </Box>
    )
}