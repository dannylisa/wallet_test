import React, { useCallback, useMemo } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { StyleSheet } from "react-native";
import { Box, fontfaces, shadow, Typography } from "@/materials";
import { useRecoilValue } from "recoil";
import { myWalletsState } from "@/modules/my-wallets.atom";
import { fAddress } from "@/utils/format-address";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

interface MyWalletsBottomSheetProps {
    sheetRef: React.RefObject<BottomSheetModalMethods>
    onSelect: (address: string) => void
}

const styles = StyleSheet.create({
    bottomSheet: {
        ...shadow,
        borderColor:"#d2d3d4",
        borderWidth: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    scrollView: {
        borderTopColor: "#d2d3d4",
        borderTopWidth: 1,
    },
    items: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 18,
        borderBottomColor: "#d2d3d4",
        borderBottomWidth: 1
    }
})

export const MyWalletsBottomSheet = ({sheetRef, onSelect}:MyWalletsBottomSheetProps) => {
    const snapPoints = useMemo(() => ['50%', '50%'], []);
    const myWallets = useRecoilValue(myWalletsState)
    const onSelectAddress = useCallback((address: string) => () => {
        onSelect(address)
        sheetRef.current?.close()
    }, [])

    return (
        <BottomSheetModal
            ref={sheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose
            enableDismissOnClose
        >
            <Box 
                flex={1}
                style={styles.bottomSheet}
            >
                <Typography 
                    bold
                    style={fontfaces.P1}
                    children="내 지갑 목록"
                    margin={16}
                />
                <ScrollView style={styles.scrollView}>
                    {myWallets.map(({address}, i) => (
                        <TouchableOpacity 
                            key={i} 
                            style={styles.items} 
                            onPress={onSelectAddress(address)}
                        >
                            <Typography 
                                style={fontfaces.P1}
                                bold
                                children={`Account ${i+1}`}
                            />
                            <Typography 
                                style={fontfaces.P1}
                                children={fAddress(address, 15, 4)}
                            />
                        </TouchableOpacity>
                    ))}
                    <Box padding={24} />
                </ScrollView>
            </Box>
        </BottomSheetModal>
    )
}