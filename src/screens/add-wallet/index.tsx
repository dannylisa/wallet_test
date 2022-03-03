import { BackIcon, BlankIcon, Box, fontfaces, HeaderBase, PADDING_HORIZONTAL, 
    screenStyles, Typography, TextInput, Button } from "@/materials"
import React, { useEffect, useState } from "react"
import { SafeAreaView } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ropsten } from "@/web3-config";
import { saveWalletToAsyncStorage } from "../create-wallet/saveWalletToAsyncStorage";
import { CreateWalletLoading } from "../create-wallet/CreateWalletFinal";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/navigation";
import { useNavigation } from "@react-navigation/native";

type RootScreenProp = StackNavigationProp<RootStackParamList, "AddWallet">

export function AddWallet(){
    const [loading, setLoading] = useState<boolean>(false)
    const nav = useNavigation<RootScreenProp>()

    const [pwd, setPwd] = useState<string>("")
    const [pwd2, setPwd2] = useState<string>("")
    const pwdValidator = (pwd:string) => pwd.length>7;
    const pwd2Validator = (pwd2:string) => pwd2 === pwd;

    const [pk, setPk] = useState<string>("")


    const getAccount = async () => {
        if(pwd.length<8 && pwd!==pwd2)
            return;
        setLoading(true)
        
    }

    useEffect(() => {
        if(!loading)
            return;
        const account = ropsten.eth.accounts.privateKeyToAccount(pk)
        saveWalletToAsyncStorage(account.address, pwd, pk)
            .finally(() => {
                setLoading(false)
                nav.navigate('SelectWallet')
            })
    },[loading])


    return (
        loading ? CreateWalletLoading :
        <SafeAreaView style={screenStyles.safeAreaView}>
            <KeyboardAwareScrollView style={screenStyles.defaultScreen} >
                <HeaderBase >
                    <BackIcon />
                    <Typography style={fontfaces.P1} bold >
                        기존 지갑 추가하기
                    </Typography>
                    <BlankIcon />
                </HeaderBase>
                <Box paddingHorizontal={PADDING_HORIZONTAL}>

                    <Box marginBottom={24}>
                        {/* 개인 키 입력 */}
                        <Typography style={fontfaces.H2} children="개인 키 입력" marginTop={24} />
                        <TextInput
                            placeholder="개인 키를 입력해 주세요."
                            value={pk}
                            onChangeText={setPk}
                        />
                        {/* 암호 생성 및 확인 */}
                        <Typography style={fontfaces.H2} children="암호 생성" marginTop={24} />
                        <Typography style={fontfaces.P1} children="새 암호" marginTop={12} />
                        <TextInput
                            secureTextEntry
                            placeholder="8자리 이상 입력해 주세요."
                            value={pwd}
                            onChangeText={setPwd}
                            validator={pwdValidator}
                            message="8자리 이상 입력해 주세요."
                        />
                        <Typography style={fontfaces.P1} children="암호 확인" marginTop={24} />
                        <TextInput
                            secureTextEntry
                            placeholder="암호를 다시 한 번 확인해 주세요."
                            value={pwd2}
                            onChangeText={setPwd2}
                            validator={pwd2Validator}
                            message="암호를 다시 확인해 주세요."
                        />
                    </Box>

                    <Button type="primary" onPress={getAccount}>
                        계정 불러오기
                    </Button>

                </Box>


            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}