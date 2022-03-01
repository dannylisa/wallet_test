import { Box, fontfaces, HeaderBase, screenStyles, Typography } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useRecoilValue } from "recoil";
import { getTransactions } from "@/api/get-transactions.api";
import { ITransaction } from "@/interface/transaction.interface";
import { TransactionBlock } from "./TransactionBlock";


export function Transactions(){
    const currentWallet = useRecoilValue(currentWalletState)
    const [transactions, setTransactions] = useState<ITransaction[]>([])
    const [page, setPage] = useState<number>(1)
    const [hasNext, setHasNext] = useState<boolean>(true)

    
    if(!currentWallet)
        return null

    // 테스트넷 블록에서 직접 데이터 가져오기
    // const getMoreTransactions = async () => {
    //     let targetBlockNumber:number;
    //     let txs:Transaction[] = []
    //     if(lastBlockNumber === -1){
    //         targetBlockNumber = await getBlockNumber()
    //     }
    //     else {
    //         targetBlockNumber = lastBlockNumber
    //     }

    //     // 한 번에 10개씩
    //     while(txs.length <= 10){
    //         const {
    //             nextEndBlockNumber,
    //             transactions
    //         } = await getTransactionsByAccount(currentWallet.address, targetBlockNumber)
    //         txs.push(...transactions)
    //         targetBlockNumber = nextEndBlockNumber
    //         console.log(txs)
    //     }
    //     setLastBlockNumber(targetBlockNumber)
    //     setTransactions(txs)
    // }

    const fetchTransactions = useCallback(() => {
        if(!hasNext)
            return;
        const offset = 10;
        getTransactions(currentWallet.address, page, 10)
            .then(res => {
                setTransactions(prev => prev.concat(res.data.result))
                setPage(prev => prev+1)
                // 10개 불러왔는데 10개 가져왔으면 뒤에 더 있음.
                setHasNext(res.data.result.length === offset)
            })
    },[hasNext, currentWallet, page])

    useEffect(() => {
        fetchTransactions()
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
                {transactions.map(tx => (
                    <TransactionBlock 
                        address={currentWallet.address}
                        transaction={tx}
                        key={tx.blockNumber} 
                    />
                ))}
            </ScrollView>
        </SafeAreaView>

    )
}