import React from "react"
import { SafeAreaView, View } from "react-native"
import { BackIcon, BlankIcon, Box, fontfaces, HeaderBase, PADDING_HORIZONTAL, screenStyles, shadow, Tag, Typography } from "@/materials"
import { currentWalletState } from "@/modules/current-wallet.atom"
import assert from "assert"
import { useRecoilValue, useResetRecoilState } from "recoil"
import { WalletView } from "./WalletView"
import QRCode from "react-native-qrcode-svg"

export function Home(){
    const currentWallet = useRecoilValue(currentWalletState)
    const resetCurrentWallet = useResetRecoilState(currentWalletState)
    assert(currentWallet)

    

    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <View style={screenStyles.defaultScreen} >
                <HeaderBase>
                    <BackIcon onPress={resetCurrentWallet} />
                    <Typography 
                        bold
                        style={fontfaces.P1}
                        children="계좌 정보"
                    />
                    <BlankIcon />
                </HeaderBase>
                <Box paddingHorizontal={PADDING_HORIZONTAL} marginTop={24}>
                    {/* 지갑 미리보기 */}
                    <WalletView wallet={currentWallet} />

                    <Box marginTop={32} alignItems="center">
                        <Typography 
                            bold 
                            style={fontfaces.P1}
                            children="이 계좌로 입금하기"
                            marginBottom={16}
                        />
                        <QRCode 
                            value={currentWallet.address}
                            size={220}
                        />
                    </Box>

                </Box>
            </View>
        </SafeAreaView>
    )
}