import { Dimensions, StyleSheet } from "react-native";

const BACKGROUND = "#fff"

export const screenStyles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: BACKGROUND,
        flex: 1
    },
    defaultScreen: {
        flex: 1,
        padding: 22,
        minHeight: Dimensions.get('window').height,
    }
})