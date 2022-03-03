import React from "react";
import { Box, Button, fontfaces, screenStyles, Typography } from "@/materials";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackNavigationProp } from "@react-navigation/stack";
import { WithdrawParamList } from "@/navigation/bottom-tab/WithdrawNavigator";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabParamList } from "@/navigation/bottom-tab";


type WithdrawScreenProp = StackNavigationProp<WithdrawParamList, "withdraw/requested">
type BottomTabProp = StackNavigationProp<BottomTabParamList, "Withdraw">
type CompositeProp = CompositeNavigationProp<WithdrawScreenProp, BottomTabProp>

export function Requested (){
    const nav = useNavigation<CompositeProp>()

    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <View style={screenStyles.defaultScreen}>
                <Box flex={1} alignItems="center" justifyContent="center">
                    <Ionicons 
                        name="ios-checkmark-circle-outline" 
                        color={"#a2fca2"}
                        size={64}  
                    />
                    <Typography 
                        marginVertical={12}
                        style={fontfaces.P1}
                        children="출금 요청이 완료되었습니다."
                    />
                    <Button 
                        type="primary" 
                        onPress={() => nav.navigate('withdraw/main')}
                        style={{width: 240, marginVertical: 16}}
                    >
                        송금 홈으로
                    </Button>
                    <Button 
                        type="ghost" 
                        onPress={() => nav.navigate('Transactions')}
                        style={{width: 240}}
                    >
                        거래내역 보기
                    </Button>
                </Box>

            </View>
        </SafeAreaView>
    )
}