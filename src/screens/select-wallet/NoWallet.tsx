import { Box, Button, fontfaces, PADDING_HORIZONTAL, screenStyles } from "@/materials";
import { Typography } from "@/materials/Typography";
import { RootStackParamList } from "@/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { SafeAreaView, View } from "react-native";

type RootScreenProp = StackNavigationProp<RootStackParamList, "Main">

export function NoWallet(){
    const nav = useNavigation<RootScreenProp>()
    const toCreate = () => nav.navigate('CreateWallet')
    const toAdd = () => nav.navigate('AddWallet')
    
    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <View style={[screenStyles.defaultScreen, {padding: 26}]} >
                <Box>
                    <Typography 
                        style={fontfaces.H2}
                        children="현재 생성된 지갑이 없습니다."
                        marginBottom={4}
                    />
                    <Typography 
                        style={fontfaces.P1}
                        children="첫 번째 지갑을 만들어보세요!"
                    />
                </Box>
                <Box marginTop={36}>
                    <Button type="primary" onPress={toCreate}>
                        지갑 생성하기
                    </Button>
                    <Box padding={10} />
                    <Button type="ghost" onPress={toAdd}>
                        기존 지갑 등록
                    </Button>
                </Box>
            </View>
        </SafeAreaView>
    )
}