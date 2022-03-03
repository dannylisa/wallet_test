import React, { useEffect, useState } from "react"
import { Box, fontfaces, Typography } from "@/materials"
import { ropsten } from "@/web3-config"
import Web3 from "web3"

interface EtherViewProps {
    walletAddress: string
}
export const EtherView = ({walletAddress}:EtherViewProps) => {
    const [balance, setBalance] = useState<string>("-")

    const updateBalance = () => {
        ropsten.eth
            .getBalance(walletAddress)
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
        <Box paddingVertical={16} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Typography 
                children={'Ethereum'}
                style={fontfaces.P1}
            />
            <Typography 
                bold
                children={`${balance} ETH`}
                style={fontfaces.P1}
            />
        </Box>
    )
}