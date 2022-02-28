import { Button, fontfaces, screenStyles } from "@/materials";
import { Typography } from "@/materials/Typography";
import React from "react";
import { SafeAreaView, View } from "react-native";

export function NoWallet(){
    
    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <View style={screenStyles.defaultScreen} >
                <Typography 
                    style={fontfaces.P1}
                    children="현재 생성된 지갑이 없습니다."
                    marginBottom={12}
                />
                <Button type="primary">
                    지갑 생성하기
                </Button>
            </View>
        </SafeAreaView>
    )
}