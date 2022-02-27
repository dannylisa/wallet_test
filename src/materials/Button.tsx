import React from "react"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View} from 'react-native'
import { BLACK, fontfaces, PRIMARY, SECONDARY } from "."
import { Typography } from "./Typography"

interface ButtonProps extends TouchableOpacityProps {
    type: "primary" | "ghost" | "secondary"
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        borderWidth: 1, 
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    disabled: {
        opacity: 0.6
    },
    active: {
        opacity: 1
    },
    primary: {
        backgroundColor: PRIMARY,
        borderColor: PRIMARY,
    },
    ghost: {
        backgroundColor: "#fff",
        borderColor: PRIMARY,
    },
    secondary: {
        backgroundColor: SECONDARY,
        borderColor: SECONDARY,
    }
})

export const Button = ({style, children, type, disabled, ...props}:ButtonProps) => {
    const color = type === "primary" ? "#ffffff" : type === "secondary" ? BLACK : "primary";
    const content = typeof children === "string" ? (
            <Typography 
            align="center"
            style={fontfaces.P1}
            children={children}
            color={color}
            />
        ) : (
            children
        )
    const theme = styles[type]

    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                styles.container, 
                theme,
                style, 
            ]}
            {...props}
        >
            <View style={disabled ? styles.disabled : styles.active}>
                {content}
            </View>
        </TouchableOpacity>
    )
}