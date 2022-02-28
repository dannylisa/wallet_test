import React from "react"
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { BLACK, PRIMARY, SECONDARY } from "./colors"
import { fontfaces } from './font-faces'
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
        backgroundColor: "#ffffff",
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
    let theme = styles[type]
    if(disabled)
        theme.backgroundColor = theme.backgroundColor+"aa";


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
            {content}
        </TouchableOpacity>
    )
}