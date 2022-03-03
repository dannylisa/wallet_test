import { Box, fontfaces, HeaderBase, screenStyles, shadow, Typography } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useRecoilValue } from "recoil";
import { getTransactions } from "@/api/get-transactions.api";
import { ITokenTransaction, ITransaction } from "@/interface/transaction.interface";
import { EtherTransactionBlock } from "./EtherTransactionBlock";
import { currrentTransactionsState } from "@/modules/current-transaction";
import { fAddress } from "@/utils/format-address";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Web3 from "web3";
import { ERCTokensBottomSheet } from "../withdraw/erc-tokens-bottom-sheet";
import { getTokenTransactions } from "@/api/get-token-transactions.api";
import { TokenTransactionBlock } from "./TokenTransactionBlock";

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

interface Token {
    address: string | null
    symbol: string
}
export function Transactions(){
    const currentWallet = useRecoilValue(currentWalletState)
    const [transactions, setTransactions] = useState<ITransaction[]>([])

    const currentTransactions = useRecoilValue(currrentTransactionsState)
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const [token, setToken] = useState<Token>({symbol: "ETH", address: null})
    const ercTokenBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const openErcTokenModal = useCallback(() => {
        ercTokenBottomSheetModalRef.current?.present();
        Keyboard.dismiss()
    }, []);

    if(!currentWallet)
        return null


    const fetchTransactions = useCallback(() => {
        setRefreshing(true);
        const offset = 100;
        if(token.address){
            getTokenTransactions(currentWallet.address, token.address, 1, offset)
                .then(res => {
                    setTransactions(res.data.result)
                    setRefreshing(false)
                })
        } else {
            getTransactions(currentWallet.address, 1, offset)
                .then(res => {
                    setTransactions(res.data.result)
                    setRefreshing(false)
                })
        }
    },[currentWallet, token])

    useEffect(() => {
        setTransactions([])
        fetchTransactions()
    },[currentTransactions.length, token.address])

    
    return (
        <BottomSheetModalProvider>
            <SafeAreaView style={screenStyles.safeAreaView}>
                <HeaderBase style={{justifyContent: "center"}} >
                    <Typography 
                        style={fontfaces.P1}
                        bold
                        children="거래 내역"
                    />
                </HeaderBase>
                <View style={screenStyles.defaultScreen} >            
                    <ScrollView 
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
                                        style={fontfaces.D1}
                                        children={`tx Hash: ${fAddress(tx.hash, 20, 6)}`}
                                    />
                                )}
                                <Typography 
                                    marginTop={8}
                                    align="right"
                                    style={fontfaces.P1}
                                    children={`${Web3.utils.fromWei(tx.value)} ${tx.symbol || 'ETH'}`}
                                />
                            </Box>
                        ))}


                        <Box 
                            padding={16}
                            style={styles.borderBottom}
                            flexDirection="row"
                            justifyContent="space-between" 
                            alignItems="center" 
                        >
                            <Typography 
                                bold
                                style={fontfaces.P1}
                                children="지난 거래내역"
                            />
                            <Typography 
                                color="primary"
                                style={fontfaces.D1}
                                children="다른 토큰 보기"
                                onPress={openErcTokenModal}
                            />
                        </Box>
                        {transactions.map(tx => (
                            token.address ? 
                            <TokenTransactionBlock 
                                address={currentWallet.address}
                                transaction={tx as ITokenTransaction}
                                key={tx.blockNumber} 
                            /> :
                            <EtherTransactionBlock 
                                address={currentWallet.address}
                                transaction={tx}
                                key={tx.blockNumber} 
                            />
                        ))
                        }
                        <View style={{padding: 100}} />
                    </ScrollView>
                    <ERCTokensBottomSheet 
                        sheetRef={ercTokenBottomSheetModalRef} 
                        onSelect={setToken}
                        walletAddress={currentWallet.address}
                    />
                </View>
            </SafeAreaView>
        </BottomSheetModalProvider>
    )
}


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