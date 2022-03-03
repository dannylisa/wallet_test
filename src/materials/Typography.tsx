import React from "react"
import { Text, TextProps } from "react-native"
import { BLACK, DANGER, DESCRIPTION, PRIMARY } from "."
import { extractShortcuts, StyleShortcut } from "./styleShortcut"


interface TypographyProps extends TextProps, StyleShortcut {
    bold?: boolean
    align?: "left" | "center" | "right"
    color?: string | "primary" | "description" | "normal" | "danger"
}
export const Typography = ({bold, align, color, style, ...props}:TypographyProps) => {
    const {shortcut, others} = extractShortcuts(props)
    
    const textStyle = {
        textAlign: align,
    }
    if(bold !== undefined)
        Object.assign(textStyle, {fontWeight: bold ? "bold" : "normal"})
    if(color !== undefined){
        let c;
        switch (color) {
            case "primary":
                c = PRIMARY
                break;
            case "description":
                c = DESCRIPTION
                break;
            case "normal":
                c = BLACK
                break;
            case "danger":
                c = DANGER;
                break;
            default:
                c = color
                break;
        }
        Object.assign(textStyle, {color: c})
    }
    
    return (
        <Text style={[style, textStyle, shortcut]} {...others} />
    )
}