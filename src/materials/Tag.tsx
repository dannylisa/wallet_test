import React from "react"
import { View, StyleSheet } from "react-native"
import { Typography } from "./Typography"

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 7,
        borderWidth: 1,
    },
    text: {
        fontSize: 12
    }
})

type tagColorType = "red" | "green" | "blue" | "purple"
interface TagColor {
    borderColor: string
    backgroundColor: string
    color: string
}
interface TagProps {
    color: tagColorType
    children: string
}

const TagColors:{[key in tagColorType]: TagColor} = {
    red: {
        color: "#cf1322",
        backgroundColor: "#fff1f0",
        borderColor: "#ffa39e",
    },
    green: {
        color: "#389e0d",
        backgroundColor: "#f6ffed",
        borderColor: "#b7eb8f",
    
    },
    blue: {
        color: "#096dd9",
        backgroundColor: "#e6f7ff",
        borderColor: "#91d5ff",
    },
    purple: {
        color: "#531dab",
        backgroundColor: "#f9f0ff",
        borderColor: "#d3adf7",
    }
}
export const Tag = ({color:theme, children}:TagProps) => {
    const {color, ...viewStyle} = TagColors[theme]
    return (
        <View style={[styles.container, viewStyle]} >
            <Typography 
                align="center"
                style={styles.text}
                color={color}
                children={children}
            />
        </View>
    )
}