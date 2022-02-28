import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "@/screens/home";

export type BottomTabParamList = {
    Home: undefined
}
const BottomTab = createBottomTabNavigator<BottomTabParamList>()
export default function BottomTabNavigator(){

    return (
        <BottomTab.Navigator>
            <BottomTab.Screen 
                name="Home" 
                component={Home}
                options={{
                    headerShown: false,
                }}
            />
        </BottomTab.Navigator>
    )
}