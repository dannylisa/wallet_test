import { Box, fontfaces, HeaderBase, screenStyles, Typography } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useRecoilValue } from "recoil";


export function Transactions(){
    const currentWallet = useRecoilValue(currentWalletState)

    
    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <HeaderBase style={{justifyContent: "center"}} >
                <Typography 
                    style={fontfaces.P1}
                    bold
                    children="출금"
                />
            </HeaderBase>

            <View style={screenStyles.defaultScreen} >
            </View>
        </SafeAreaView>

    )
}