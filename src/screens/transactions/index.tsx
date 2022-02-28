import { BackIcon, Box, fontfaces, HeaderBase, screenStyles, Typography } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import { web3 } from "@/web3-config";
import { Transaction } from "web3-eth";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useRecoilValue } from "recoil";
import { getBlockNumber, getTransactionsByAccount } from "./get-transactions";


export function Transactions(){
    const currentWallet = useRecoilValue(currentWalletState)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [lastBlockNumber, setLastBlockNumber] = useState<number>(-1)

    
    if(!currentWallet)
        return null

    const getMoreTransactions = async () => {
        let targetBlockNumber:number;
        let txs:Transaction[] = []
        if(lastBlockNumber === -1){
            targetBlockNumber = await getBlockNumber()
        }
        else {
            targetBlockNumber = lastBlockNumber
        }

        // 한 번에 10개씩
        while(txs.length <= 10){
            const {
                nextEndBlockNumber,
                transactions
            } = await getTransactionsByAccount(currentWallet.address, targetBlockNumber)
            txs.push(...transactions)
            targetBlockNumber = nextEndBlockNumber
            console.log(txs)
        }
        setLastBlockNumber(targetBlockNumber)
        setTransactions(txs)
    }

    useEffect(() => {
        getMoreTransactions()
    },[])
    
    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <HeaderBase style={{justifyContent: "center"}} >
                <Typography 
                    style={fontfaces.P1}
                    bold
                    children="거래 내역"
                />
            </HeaderBase>
            <ScrollView style={screenStyles.defaultScreen} >
            
            </ScrollView>
        </SafeAreaView>

    )
}