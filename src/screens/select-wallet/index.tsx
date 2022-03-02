import { IStorageWallet } from "@/interface/storage-wallet.interface";
import { Tag, Typography, shadow, Box, Button, fontfaces, screenStyles, PADDING_HORIZONTAL } from "@/materials";
import { currentWalletState } from "@/modules/current-wallet.atom";
import { myWalletsState } from "@/modules/my-wallets.atom";
import { RootStackParamList } from "@/navigation";
import { fAddress } from "@/utils/format-address";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRecoilState, useSetRecoilState } from "recoil";

import { NoWallet } from "./NoWallet";

const styles = StyleSheet.create({
    walletContainer: {
        marginHorizontal: 4,
        marginVertical: 8,
        padding: 16,
    }
})

type RootScreenProp = StackNavigationProp<RootStackParamList, "CreateWallet">


export function SelectWallet(){
    const nav = useNavigation<RootScreenProp>()
    const toCreate = () => nav.navigate('CreateWallet')
    const toAdd = () => nav.navigate('AddWallet')
    
    const [wallets, setWallets] = useRecoilState(myWalletsState)
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


    return ( wallets.length > 0 ?
        <SafeAreaView style={screenStyles.safeAreaView}>
            <ScrollView style={[screenStyles.defaultScreen, {padding: PADDING_HORIZONTAL}]}  >
                <Typography 
                    style={fontfaces.H1}
                    children="내 지갑 목록"
                    marginVertical={12}
                />


                {wallets.map((wallet, i) => {
                    const onPress = () => setCurrentWallet(wallet)
                    const {address, createdAt} = wallet
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
                                children={`Address: ${fAddress(address, 12, 8)}`}
                                marginBottom={7}
                                bold
                            />
                            <Typography
                                style={fontfaces.D1}
                                children={dayjs(createdAt).format('YYYY-MM-DD 등록')}
                                marginBottom={7}
                                bold
                            />
                        </TouchableOpacity>
                    )
                })}

                <Box marginTop={16}>
                    <Button type="primary" onPress={toCreate}>
                        지갑 생성하기
                    </Button>
                </Box>
                <Box marginTop={16}>
                    <Button type="ghost" onPress={toAdd}>
                        기존 지갑 등록
                    </Button>
                </Box>
            </ScrollView>
        </SafeAreaView>
        :
        <NoWallet />
    )
}