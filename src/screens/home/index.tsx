import React, { useEffect, useState } from "react"
import { SafeAreaView, View } from "react-native"
import { Box, fontfaces, screenStyles, shadow, Typography } from "@/materials"
import { currentWalletState } from "@/modules/current-wallet.atom"
import assert from "assert"
import { useRecoilValue } from "recoil"
import { web3 } from "@/web3-config"

export function Home(){
    const currentWallet = useRecoilValue(currentWalletState)
    assert(currentWallet)

    const [balance, setBalance] = useState<number>(0)
    useEffect(() => {
        web3.eth
            .getBalance(currentWallet.address)
            .then(res => {
                console.log(res)
            })
    },[])


    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <View style={screenStyles.defaultScreen} >
                <Box style={shadow} padding={12} marginTop={16}>
                    <Typography 
                        align="center"
                        style={fontfaces.H1}
                        children="이더리움 지갑"
                    />
                    <Typography 
                        align="center"
                        style={fontfaces.D1}
                        children={currentWallet.address}
                    />
                    <Typography 
                        align="center"
                        style={fontfaces.H2}
                        children={`${balance} eth`}
                    />
                </Box>
            </View>
        </SafeAreaView>
    )
}