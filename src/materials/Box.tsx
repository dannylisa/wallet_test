import React from "react";
import { GestureResponderEvent, View, ViewProps } from "react-native";
import { StyleShortcut, extractShortcuts } from "./styleShortcut";

export interface BoxProps extends StyleShortcut, ViewProps {
    children?: React.ReactNode
    onPress?: (event?: GestureResponderEvent) => void

    borderRadius?: number;
    backgroundColor?: string;

    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse"
    alignItems?: "stretch" | "center" | "flex-start" | "flex-end" | "baseline" 
    justifyContent?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly"
    position?: "absolute" | "relative"
}


export function Box({
        children, 
        onPress,
        borderRadius, backgroundColor,
        flexDirection, alignItems, justifyContent,
        position, style, ...props}:BoxProps
    ){
    const boxStyle = {
        borderRadius, backgroundColor,
        flexDirection, alignItems, justifyContent,
        position
    }
    const {shortcut, others} = extractShortcuts(props);
    return (
        <View
            onStartShouldSetResponder={onPress}
            style={[boxStyle, shortcut, style]} {...others}>
            {children}
        </View>
    )

}