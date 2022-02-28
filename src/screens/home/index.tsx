import { Button, screenStyles } from "@/materials";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Wallet } from "ethers";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { NoWallet } from "./NoWallet";

export function Home(){
    const [wallets, setWallets] = useState<Wallet[]>([])
    useEffect(() => {
        AsyncStorage
            .getItem('WALLETS')
            .then(res => {
                if(res)
                    setWallets(JSON.parse(res))
            })
    },[])


    return (
        wallets.length ?
        <SafeAreaView style={screenStyles.safeAreaView}>
            <ScrollView style={screenStyles.defaultScreen} >
                <Button type="primary">
                    지갑 생성하기
                </Button>
            </ScrollView>
        </SafeAreaView>
        :
        <NoWallet />
    )
}