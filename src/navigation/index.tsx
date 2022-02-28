import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./bottom-tab";
import { CreateWallet } from "@screens/create-wallet";

export type RootStackParamList = {
    "Main": undefined
    "CreateWallet": undefined
}

const Stack = createStackNavigator<RootStackParamList>()
export default function Navigation(){
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Main" component={BottomTabNavigator} />
                <Stack.Screen name="CreateWallet" component={CreateWallet} />
    
            </Stack.Navigator>
        </NavigationContainer>
    )
}