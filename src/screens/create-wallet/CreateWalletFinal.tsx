import React, { useMemo, useState } from "react"
import * as bip39 from 'bip39';
import { Box, Button, DESCRIPTION, fontfaces, PRIMARY, TextInput } from "@/materials";
import { hdkey } from 'ethereumjs-wallet';
import { Wallet } from 'ethers';
import { StyleSheet, View } from "react-native";
import { Typography } from "@/materials/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { setKeychainItem } from "@/utils/secure-key-store";
import { ACCESSIBLE } from 'react-native-keychain';


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

const CreateWalletLoading = (
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


    const saveWalletToAsyncStorage = async (wallet:Wallet) => {
        try {
            // 기존 지갑 목록 정보 가져오기
            const walletsInStorage = await AsyncStorage.getItem('WALLETS')
            const wallets = walletsInStorage ? JSON.parse(walletsInStorage) : [];
            // 기존 지갑 목록에 추가하기
            wallets.push(wallet);
            // 지갑 목록 정보 저장하기
            await AsyncStorage.setItem('WALLETS', JSON.stringify(wallets));
            
            // 개인키를 안전한 영역에 저장
            setKeychainItem(
                wallet.address, 
                wallet.privateKey, 
                {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY}
            )
            

          } catch (error) {
            // Error saving data
            console.log(error);
          }
    }

    const createWallet = async ()=> {
        setLoading(true)
        const seed = await bip39.mnemonicToSeed(mnemonic, password)

        const index = 1;
        const hdNode = hdkey.fromMasterSeed(seed);
        const node = hdNode.derivePath(`m/44'/60'/0'`)
        const change = node.deriveChild(0);

        // m/44'/60'/0'/0/{N}
        const childNode = change.deriveChild(index);
        const childWallet = childNode.getWallet();
        const wallet = new Wallet(childWallet.getPrivateKey().toString('hex'));

        // Async Storage에 Wallet 정보 저장
        saveWalletToAsyncStorage(wallet)



        setLoading(false)
        return wallet

    }
    return (
        !loading ? CreateWalletLoading :
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
                    disabled={mnemonics[target] === targetValue}
                >
                    지갑 생성
                </Button>
            </Box>
        </Box>
    )
}