import { Dimensions, StyleSheet } from "react-native";

const BACKGROUND = "#fff"
export const PADDING_HORIZONTAL = 22;
export const HEADER_HEIGHT = 64;

export const screenStyles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: BACKGROUND,
        flex: 1
    },
    defaultScreen: {
        flex: 1,
        minHeight: Dimensions.get('window').height,
    }
})