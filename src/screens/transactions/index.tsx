import { Box, fontfaces, HeaderBase, screenStyles, shadow, Typography } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { getTransactions } from "@/api/get-transactions.api";
import { ITransaction } from "@/interface/transaction.interface";
import { TransactionBlock } from "./TransactionBlock";
import { currrentTransactionsState } from "@/modules/current-transaction";
import { fAddress } from "@/utils/format-address";
import Web3 from "web3";

const styles = StyleSheet.create({
    borderBottom: {
        borderBottomColor: "#d2d3d4",
        borderBottomWidth: 0.5,
    },
    currentTx: {
        marginBottom: 12,
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 6,
        ...shadow
    }
})

export function Transactions(){
    const currentWallet = useRecoilValue(currentWalletState)
    const [transactions, setTransactions] = useState<ITransaction[]>([])
    const [page, setPage] = useState<number>(1)
    const [hasNext, setHasNext] = useState<boolean>(true)

    const currentTransactions = useRecoilValue(currrentTransactionsState)
    const [refreshing, setRefreshing] = useState<boolean>(false);

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
        setRefreshing(true);
        const offset = 10;
        getTransactions(currentWallet.address, page, 10)
            .then(res => {
                setTransactions(prev => prev.concat(res.data.result))
                setPage(prev => prev+1)
                // 10개 불러왔는데 10개 가져왔으면 뒤에 더 있음.
                setHasNext(res.data.result.length === offset)
                setRefreshing(false)
            })
    },[hasNext, currentWallet, page])

    useEffect(() => {
        fetchTransactions()
    },[currentTransactions.length])

    
    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <HeaderBase style={{justifyContent: "center"}} >
                <Typography 
                    style={fontfaces.P1}
                    bold
                    children="거래 내역"
                />
            </HeaderBase>
            <ScrollView 
                style={screenStyles.defaultScreen} 
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchTransactions}
                    />
                }
            >
                {currentTransactions.length > 0 && (
                    <Typography 
                        bold
                        padding={16}
                        style={fontfaces.P1}
                        children="현재 진행 중인 거래"
                    />
                )}
                {currentTransactions.map(tx => (
                    <Box style={styles.currentTx} key={tx.id}>
                        <Box flexDirection="row" justifyContent="space-around" alignItems="center">
                            <Typography 
                                style={fontfaces.P1}
                                children={`${fAddress(tx.from, 8)}`}
                            />
                            <Typography 
                                style={fontfaces.H2}
                                children="→"
                                marginTop={-10}
                            />
                            <Typography 
                                style={fontfaces.P1}
                                children={fAddress(tx.to, 8)}
                            />

                        </Box>
                        <Typography 
                            align="left"
                            style={fontfaces.D1}
                            children={`status: ${tx.status}`}
                        />
                        {tx.hash && (
                            <Typography 
                                align="right"
                                marginTop={4}
                                style={fontfaces.D1}
                                children={`tx Hash: ${tx.hash}`}
                            />
                        )}
                        <Typography 
                            marginTop={8}
                            align="right"
                            style={fontfaces.P1}
                            children={`${Web3.utils.fromWei(tx.value)} ETH`}
                        />
                    </Box>
                ))}

                <Typography 
                    bold
                    padding={16}
                    style={[fontfaces.P1, styles.borderBottom]}
                    children="지난 거래내역"
                />
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