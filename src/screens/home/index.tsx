import React, { useEffect, useState } from "react"
import { SafeAreaView, View } from "react-native"
import { BackIcon, BlankIcon, Box, fontfaces, HeaderBase, 
    PADDING_HORIZONTAL, screenStyles, Typography, TextInput, Button } from "@/materials"
import { currentWalletState } from "@/modules/current-wallet.atom"
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil"
import { WalletView } from "./WalletView"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { erc20TokensState } from "@/modules/erc-tokens"
import Web3 from "web3"
import { ropsten } from "@/web3-config"
import { minAbi } from "@/utils/erc20-abi"
import { EtherView } from "./EtherView"
import { ERCTokenView } from "./ERCTokenView"


export function Home(){
    const currentWallet = useRecoilValue(currentWalletState)
    const resetCurrentWallet = useResetRecoilState(currentWalletState)

    const [erc20Tokens, setErc20Tokens] = useRecoilState(erc20TokensState)
    const [newERCAddress, setNewERCaddress] = useState<string>("")
    const onAddERC = async () => {
        setErc20Tokens(prev => {
            const updatedAddresses = [...prev, newERCAddress]
            // 로컬 저장소에 저장
            AsyncStorage.setItem('ERC20', JSON.stringify(updatedAddresses));
            return updatedAddresses;
        })
        setNewERCaddress('')
    }

    // 로컬에서 불러오기
    useEffect(() => {
        AsyncStorage
        .getItem('ERC20')
        .then(addresses => {
            setErc20Tokens(JSON.parse(addresses || "[]"))
        }).catch((e) => {
            console.log(e)
        })
    },[])

    
    if(!currentWallet)
        return null;
    

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
                <Box paddingHorizontal={PADDING_HORIZONTAL}>
                    <Typography 
                        style={fontfaces.H2}
                        children="내 지갑"
                        marginVertical={16}
                    />
                    {/* 지갑 미리보기 */}
                    <WalletView wallet={currentWallet} />


                    <TextInput 
                        containerStyle={{marginTop: 12}}
                        value={newERCAddress}
                        onChangeText={setNewERCaddress}
                        placeholder="추가할 ERC-20 토큰의 컨트랙트 주소를 입력해보세요."
                        validator={Web3.utils.isAddress}
                        message="올바른 지갑 주소가 아닙니다."
                        Right={(
                            <Button 
                                type="primary" 
                                style={{marginLeft: 10, paddingVertical: 6}}
                                onPress={onAddERC}
                            >
                                추가
                            </Button>
                        )}
                    />


                    <Typography 
                        style={fontfaces.H2}
                        children="내 자산"
                        marginTop={12}
                    />
                    <EtherView walletAddress={currentWallet.address} />
                    {erc20Tokens.map(tokenAddr => (
                        <ERCTokenView 
                            key={tokenAddr}
                            tokenAddress={tokenAddr} 
                            walletAddress={currentWallet.address} 
                        />
                    ))}


                    

                </Box>
            </View>
        </SafeAreaView>
    )
}