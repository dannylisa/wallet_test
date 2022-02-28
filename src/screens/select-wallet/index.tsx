import { IStorageWallet } from "@/interface/storage-wallet.interface";
import { Tag, Typography, shadow, Box, Button, fontfaces, screenStyles } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import { RootStackParamList } from "@/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSetRecoilState } from "recoil";
import Web3 from "web3";

import { NoWallet } from "./NoWallet";

const styles = StyleSheet.create({
    walletContainer: {
        marginHorizontal: 4,
        marginVertical: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    }
})

type RootScreenProp = StackNavigationProp<RootStackParamList, "CreateWallet">


export function SelectWallet(){
    const nav = useNavigation<RootScreenProp>()
    const toCreate = () => nav.navigate('CreateWallet')
    
    const [wallets, setWallets] = useState<IStorageWallet[]>([])
    const setCurrentWallet = useSetRecoilState(currentWalletState)


    const refreshWalles = () => {
        // AsyncStorage
        //     .setItem('WALLETS', '')
        AsyncStorage
            .getItem('WALLETS')
            .then(res => {
                if(res)
                    setWallets(JSON.parse(res))
            })
    }

    useEffect(()=>{
        const unsubscribe = nav.addListener("focus", refreshWalles)
        return unsubscribe
    },[nav])


    return ( wallets.length ?
        <SafeAreaView style={screenStyles.safeAreaView}>
            <ScrollView style={screenStyles.defaultScreen} >
                <Box>
                    <Typography 
                        style={fontfaces.H1}
                        children="내 지갑 목록"
                    />
                </Box>
                {wallets.map((wallet, i) => {
                    const onPress = () => setCurrentWallet(wallet)
                    const {address, privateKey} = wallet
                    return (
                        <TouchableOpacity 
                            key={i}
                            style={[styles.walletContainer, shadow]} 
                            onPress={onPress}
                        >
                            <Typography
                                style={fontfaces.H2}
                                children={`Account ${i+1}`}
                                marginBottom={4}
                                bold
                            />
                            <Typography
                                style={fontfaces.P1}
                                children={`Address: ${address.slice(0,12)}...${address.slice(-8)}`}
                                marginBottom={7}
                                bold
                            />
                            <Tag
                                color="blue"
                                children={`Private Key: ${privateKey.slice(0,20)}...${privateKey.slice(-10)}`}
                            />
                        </TouchableOpacity>
                    )
                })}

                <Box marginTop={16}>
                    <Button type="primary" onPress={toCreate}>
                        지갑 생성하기
                    </Button>
                </Box>
            </ScrollView>
        </SafeAreaView>
        :
        <NoWallet />
    )
}