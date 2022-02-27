import React from "react";
import { StyleSheet, TextInputProps, TextInput as DefaultTextInput } from "react-native";
import { fontfaces } from ".";
import { Typography } from "./Typography";


interface TIProps extends TextInputProps {
    validator?: (text: string) => boolean
    message?: string
}

const styles = StyleSheet.create({
    container: {
        borderBottomColor: '#ADB5BD',
        borderBottomWidth: 1,
        borderBottomEndRadius: 5,
        paddingBottom: 3
    }
})

export const TextInput = ({style, validator, message, ...props}:TIProps) => {
    return (
        <>
            <DefaultTextInput 
                style={[styles.container, style]}
                {...props}
            />
            {validator && message && (
                <Typography 
                    color="danger" 
                    style={fontfaces.D1}
                    marginTop={5}
                    children={
                        props.value && !validator(props.value) ? message : " "
                    } 
                />
            )}
        </>
    )
}