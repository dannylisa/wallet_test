import { StyleSheet } from "react-native";
import { BLACK, DESCRIPTION } from "./colors";

export const fontfaces = StyleSheet.create({
    H1:{
        fontSize: 25,
        color: BLACK,
        fontWeight: 'bold',
        fontFamily: 'NEXONLv1GothicOTFBold'
    },
    H2:{
        fontSize: 22,
        color: BLACK,
        fontWeight: 'bold',
        fontFamily: 'NEXONLv1GothicOTFBold'
    },
    P1:{
        fontSize: 16,
        color: BLACK,
        fontFamily: 'NEXONLv1GothicOTFRegular'
    },
    P2:{
        fontSize: 14,
        color: BLACK,
        fontFamily: 'NEXONLv1GothicOTFRegular'
    },
    D1:{
        fontSize: 12,
        color: DESCRIPTION,
        fontFamily: 'NEXONLv1GothicOTFRegular'
    },
    D2:{
        fontSize: 10,
        color: DESCRIPTION,
        fontFamily: 'NEXONLv1GothicOTFRegular'
    },
    bold: {
        fontWeight: 'bold'
    },
    primary: {
        color: '#3388ff'
    }
})