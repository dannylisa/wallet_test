import { Box, fontfaces, Typography } from "@/materials"
import { minAbi } from "@/utils/erc20-abi"
import { ropsten } from "@/web3-config"
import React, { useEffect, useState } from "react"
import Web3 from "web3"

interface ERCTokenViewProps {
    walletAddress: string
    tokenAddress: string
}
export const ERCTokenView = ({tokenAddress, walletAddress}:ERCTokenViewProps) => {
    const [name, setName] = useState<string>("")
    const [symbol, setSymbol] = useState<string>("")
    const [balance, setBalance] = useState<number>(-1)

    const refreshToken = () => {
        const contract = new ropsten.eth.Contract(minAbi, tokenAddress);

        contract.methods.name().call().then(setName)
        contract.methods.symbol().call().then(setSymbol)
        contract.methods.balanceOf(walletAddress).call().then((bal: string) => setBalance(+Web3.utils.fromWei(bal)))
    }
    useEffect(() => {
        refreshToken()

        // 5초마다 자산 최신화
        const timerId = setInterval(refreshToken, 5000)
        return () => clearInterval(timerId)
        
    },[])

    if(!name || !symbol || balance===-1)
        return null
    return (
        <Box paddingVertical={12} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Typography 
                children={name}
                style={fontfaces.P1}
            />
            <Typography 
                bold
                children={`${balance} ${symbol}`}
                style={fontfaces.P1}
            />
        </Box>
    )
}