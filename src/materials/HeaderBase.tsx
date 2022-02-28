import React from "react"
import { useNavigation } from "@react-navigation/core"
import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import { StyleSheet, View } from "react-native"
import { Box, BoxProps } from "./Box"
import { HEADER_HEIGHT, PADDING_HORIZONTAL } from "./screen-styles"
import { shadow } from "./shadow"

const styles = StyleSheet.create({
    header: {
        height: HEADER_HEIGHT,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: PADDING_HORIZONTAL,
        zIndex: 1,
        borderBottomColor: "#d2d3d4",
        borderBottomWidth: 1
    }
})
export const HeaderBase = ({children,style, ...props}:BoxProps) => {
    const {header} = styles
    return (
        <Box style={[header, style]} {...props}>
            {children}
        </Box>
    )
}


interface BackIconProps {
    onPress?: () => void
}

export const BackIcon = ({onPress}:BackIconProps) => {
    const nav = useNavigation()
    onPress = onPress || nav.goBack
    return (
        <Feather name="chevron-left" size={24} onPress={onPress} />
    )
}
export const CloseIcon = ({onPress}:BackIconProps) => {
    const nav = useNavigation()
    onPress = onPress || nav.goBack
    return (
        <AntDesign name="close" size={24} onPress={onPress} />
    )
}

export const BlankIcon = () => (
    <View style={{paddingHorizontal: 12}} />
)