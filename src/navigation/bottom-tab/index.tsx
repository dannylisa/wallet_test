import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "@screens/home";
import { CreateWallet } from "@/screens/create-wallet";

export type BottomTabParamList = {
    Home: undefined
}
const BottomTab = createBottomTabNavigator<BottomTabParamList>()
export default function BottomTabNavigator(){

    return (
        <BottomTab.Navigator>
            <BottomTab.Screen 
                name="Home" 
                component={CreateWallet}
                options={{
                    headerShown: false,
                }}
            />
        </BottomTab.Navigator>
    )
}