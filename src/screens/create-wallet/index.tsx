import { BackIcon, BlankIcon, Box, fontfaces, HeaderBase, PADDING_HORIZONTAL, screenStyles } from "@/materials"
import { Typography } from "@/materials/Typography"
import React, { useEffect, useMemo, useState } from "react"
import * as Bip39 from 'bip39';
import { SafeAreaView } from "react-native"
import CreatePassword from "./CreatePassword"
import { GenerateMnemonic } from "./GenerateMnemonic"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CreateWalletFinal } from "./CreateWalletFinal"


export function CreateWallet(){
    const [step, setStep] = useState<number>(1)

    const [password, setPassword] = useState<string>("")
    const [mnemonic, setMnemonic] = useState<string>("")

    // 니모닉 생성
    const requestMnemonic = () => {
        const mnemonic_result = Bip39.generateMnemonic()
        setMnemonic(mnemonic_result)
    }
    useEffect(requestMnemonic, [])
    
    const toGenerateMnemonicStep = (pwd: string) => {
        setStep(2)
        setPassword(pwd)
    }
    const backToGenerateMnemonicStep = () => setStep(2)
    const toCreateWalletFinalStep = () => setStep(3)

    // for step 3
    // 문제 구문
    const target = useMemo(() => Math.floor(Math.random()*12), [mnemonic])


    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <KeyboardAwareScrollView style={screenStyles.defaultScreen} >
                <HeaderBase >
                    <BackIcon />
                    <Typography style={fontfaces.P1} bold >
                        지갑 추가하기
                    </Typography>
                    <BlankIcon />
                </HeaderBase>
                <Box paddingHorizontal={PADDING_HORIZONTAL}>

                    <Box marginVertical={16} flexDirection="row" justifyContent="space-evenly">
                        <Typography 
                            style={fontfaces.D1} 
                            color={step > 1 ? "description" : "primary" }
                        >
                            1. 암호 생성
                        </Typography>
                        <Typography style={fontfaces.D1} children={'>'} />
                        <Typography 
                            style={fontfaces.D1} 
                            color={step > 2 ? "description" : step < 2 ? "normal" : "primary" }
                        >
                            2. 계정 시드 구문 기록
                        </Typography>
                        <Typography style={fontfaces.D1} children={'>'} />
                        <Typography 
                            style={fontfaces.D1} 
                            color={step < 3 ? "normal" : "primary"}
                        >
                            3. 계정 시드 구문 확인
                        </Typography>
                    </Box>

                    <Box paddingVertical={20}>
                        {step === 1 ? 
                        <CreatePassword onNext={toGenerateMnemonicStep} />
                        : step === 2 ?
                        <GenerateMnemonic 
                            onNext={toCreateWalletFinalStep} 
                            mnemonic={mnemonic}
                        />
                        :
                        <CreateWalletFinal 
                            toBack={backToGenerateMnemonicStep}
                            password={password} 
                            mnemonic={mnemonic}
                            target={target}
                        />
                        }
                    </Box>

                </Box>


            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}