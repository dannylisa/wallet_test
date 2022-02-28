import React, { useEffect, useMemo, useState } from "react"
import { Box, Button, DESCRIPTION, fontfaces, PRIMARY, TextInput } from "@/materials";
import { StyleSheet, View } from "react-native";
import { Typography } from "@/materials/Typography";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/navigation";
import { useNavigation } from "@react-navigation/native";

import { createWalletKeystore } from './createWallet'
import { saveWalletToAsyncStorage } from "./saveWalletToAsyncStorage";

type RootScreenProp = StackNavigationProp<RootStackParamList, "CreateWallet">

const styles = StyleSheet.create({
    mnemonicContainer: {
        marginTop: 12,
        borderRadius: 5,
    },
    mnemonicItem: {
        width: 120,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: DESCRIPTION,
        borderRadius: 4,
        marginTop: 12,
    },
    targetItem: {
        borderColor: PRIMARY,
        borderWidth: 2,
    }
})

interface CreateWalletFinalProps {
    toBack: () => void
    target: number
    password: string
    mnemonic: string
}

export const CreateWalletLoading = (
    <Box alignItems="center" justifyContent="center" style={{height: 460}}>
        <Typography
            style={fontfaces.H2} 
            children={`지갑 생성 중입니다...`}
        />
        <Typography
            marginTop={5}
            style={fontfaces.P2} 
            children="지갑 생성에 몇 초 정도 걸릴 수 있습니다."
        />
    </Box>
)

export const CreateWalletFinal = ({toBack, password, mnemonic, target}:CreateWalletFinalProps) => {
    const [loading, setLoading] = useState<boolean>(false)

    const mnemonics = useMemo(() => mnemonic.split(' '), [mnemonic])
    const [targetValue, setTargetValue] = useState<string>("")

    const nav = useNavigation<RootScreenProp>()

    const createWallet = ()=> {
        setLoading(true)
        // 나머지는 아래 useEffect에서 실행
    }
    useEffect(() => {
        if(!loading)
            return;

        createWalletKeystore(mnemonic, password)
            .then(({address, privateKey}) => {
                saveWalletToAsyncStorage(address, password, privateKey)
            })
            .finally(() => {
                setLoading(false)
                nav.navigate('SelectWallet')
            })
    }, [loading])

    return (
        loading ? CreateWalletLoading :
        <Box justifyContent="space-between" flex={1} >
            <Typography style={fontfaces.H2} children="계정 시드 구문 확인" />
            <Typography 
                style={fontfaces.D1} 
                marginTop={4}
                children="계정 시드 구문을 확인합니다." 
            />
            <Box
                flexDirection="row" 
                justifyContent="space-evenly"
                style={styles.mnemonicContainer}
            >
                <Box marginBottom={32}>
                    {/* 홀수 번호 */}
                    {mnemonics
                        .filter((_, i) => !(i & 1))
                        .map((mn, i) => (
                            i*2 === target ? 
                            <Typography 
                                key={mn}
                                align="center"
                                style={[fontfaces.P1, styles.mnemonicItem, styles.targetItem]}
                                children={`${i*2+1}. ?`}
                            />
                            :
                            <Typography 
                                key={mn}
                                align="center"
                                style={[fontfaces.P1, styles.mnemonicItem]}
                                children={`${i*2+1}. ${mn}`}
                            />
                        ))
                    }
                </Box>
                <Box>
                    {/* 짝수 번호 */}
                    {mnemonics
                        .filter((_, i) => i & 1)
                        .map((mn, i) => (
                            (i*2+1) === target ? 
                            <Typography 
                                key={mn}
                                align="center"
                                style={[fontfaces.P1, styles.mnemonicItem, styles.targetItem]}
                                children={`${i*2+2}. ?`}
                            />
                            :
                            <Typography 
                                key={mn}
                                align="center"
                                style={[fontfaces.P1, styles.mnemonicItem]}
                                children={`${i*2+2}. ${mn}`}
                            />
                        ))
                    }
                </Box>


            </Box>
            <Typography 
                style={fontfaces.P2}
                children={`${target+1}번 시드 구문을 입력해 주세요.`}
            />
            <TextInput 
                placeholder={`${target+1}번 시드 구문 `}
                value={targetValue}
                onChangeText={setTargetValue}

            />
                
            <Box flexDirection="row" justifyContent="space-between" marginTop={24}>
                <Button type="secondary" onPress={toBack} style={{flex:1}} >
                    뒤로
                </Button>
                <View style={{padding:6}} />
                <Button 
                    type="primary" 
                    onPress={createWallet} 
                    style={{flex:1}}
                    disabled={mnemonics[target] !== targetValue}
                >
                    지갑 생성
                </Button>
            </Box>
        </Box>
    )
}