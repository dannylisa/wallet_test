import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "@/screens/home";
import Foundation from 'react-native-vector-icons/Foundation'
import Entypo from 'react-native-vector-icons/Entypo'
import { Box, DESCRIPTION, fontfaces, PRIMARY, Typography } from "@/materials";
import { Transactions } from "@/screens/transactions";

export type BottomTabParamList = {
    Home: undefined
    Transactions: undefined
}
const BottomTab = createBottomTabNavigator<BottomTabParamList>()
const tabbarOptions = {
    tabBarActiveTintColor: PRIMARY,
    tabBarInactiveTintColor: DESCRIPTION,
    tabBarShowLabel: false,
    headerShown:false,
}
export default function BottomTabNavigator(){

    return (
        <BottomTab.Navigator>
            <BottomTab.Screen 
                name="Home" 
                component={Home}
                options={{
                    tabBarIcon: HomeIcon,
                    ...tabbarOptions
                }}
                
            />
            <BottomTab.Screen 
                name="Transactions" 
                component={Transactions}
                options={{
                    tabBarIcon: TransactionsIcon,
                    ...tabbarOptions
                }}
                
            />
        </BottomTab.Navigator>
    )
}

interface TabBarIconProps {
    focused: boolean;
    color: string;
    size: number;
}
const HomeIcon = (({color}:TabBarIconProps) => (
    <Box alignItems="center">
        <Foundation name="home" size={24} color={color} />
        <Typography 
            style={fontfaces.D1}
            color={color}
            children="홈"
        />
    </Box>
))
const TransactionsIcon = (({color}:TabBarIconProps) => (
    <Box alignItems="center">
        <Entypo name="shuffle" size={24} color={color} />
        <Typography 
            style={fontfaces.D1}
            color={color}
            children="거래내역"
        />
    </Box>
))