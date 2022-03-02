import React from "react";
import { StyleSheet, TextInputProps, TextInput as DefaultTextInput, View, ViewStyle, StyleProp } from "react-native";
import { fontfaces } from ".";
import { Typography } from "./Typography";


interface TIProps extends TextInputProps {
    validator?: (text: string) => boolean
    message?: string
    containerStyle?: StyleProp<ViewStyle>
    Left?: JSX.Element
    Right?: JSX.Element
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        flex: 1,
        borderBottomColor: '#ADB5BD',
        borderBottomWidth: 1,
        paddingBottom: 2,
        paddingHorizontal: 6
    }
})

export const TextInput = ({containerStyle, style, validator, message, Left, Right, ...props}:TIProps) => {
    return (
        <>
        <View style={[styles.container, containerStyle]}>
            {Left}
            <DefaultTextInput 
                style={[styles.input, style]}
                underlineColorAndroid="transparent"
                {...props}
            />
            {Right}
        </View>
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