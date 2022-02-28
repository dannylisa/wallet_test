import { BackIcon, Box, fontfaces, HeaderBase, screenStyles, Typography } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import { web3 } from "@/web3-config";
import assert from "assert";
import React, { useEffect } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useRecoilValue } from "recoil";

export function Transactions(){
    const currentWallet = useRecoilValue(currentWalletState)
    assert(currentWallet)

    useEffect(() => {
        web3.eth.getTransaction(
            currentWallet.address, 
            (err, logs) => {
                console.log(logs)
            }
        )
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