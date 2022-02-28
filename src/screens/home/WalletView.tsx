import { IStorageWallet } from "@/interface/storage-wallet.interface";
import { Box, fontfaces, shadow, Tag, Typography } from "@/materials";
import { web3 } from "@/web3-config";
import React, { useEffect, useState } from "react";
import Web3 from "web3";

interface WalletViewProps {
    wallet: IStorageWallet
}
export const WalletView = ({wallet:{address, }}:WalletViewProps) => {
    const [balance, setBalance] = useState<string>("-")

    const updateBalance = () => {
        web3.eth
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
            <Box alignItems="flex-start" marginBottom={4}>
                <Tag color="blue" children="테스트넷"/>
            </Box>
            <Typography 
                align="center"
                style={fontfaces.H1}
                children="이더리움 지갑"
            />
            <Typography 
                align="center"
                style={fontfaces.D1}
                children={address}
            />
            <Typography 
                align="center"
                style={fontfaces.H2}
                children={`${balance} eth`}
            />
        </Box>
    )
}