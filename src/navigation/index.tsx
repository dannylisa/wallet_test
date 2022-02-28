import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./bottom-tab";
import { CreateWallet } from "@screens/create-wallet";
import { SelectWallet } from "@/screens/select-wallet";
import { useRecoilValue } from "recoil";
import { currentWalletState } from "@/modules/current-wallet.atom";
import { AddWallet } from "@/screens/add-wallet";

export type RootStackParamList = {
    "Main": undefined
    "CreateWallet": undefined
    "SelectWallet": undefined
    "AddWallet": undefined
}

const Stack = createStackNavigator<RootStackParamList>()
export default function Navigation(){
    const wallet = useRecoilValue(currentWalletState)
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                {wallet ?
                <Stack.Screen name="Main" component={BottomTabNavigator} />
                :
                <>
                    <Stack.Screen name="SelectWallet" component={SelectWallet} />
                    <Stack.Screen name="CreateWallet" component={CreateWallet} />
                    <Stack.Screen name="AddWallet" component={AddWallet} />
                </>
                }
    
            </Stack.Navigator>
        </NavigationContainer>
    )
}