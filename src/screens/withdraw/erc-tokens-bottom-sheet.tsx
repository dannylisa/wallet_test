import React, { useCallback, useMemo } from "react"
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { StyleSheet } from "react-native";
import { Box, fontfaces, shadow, Typography } from "@/materials";
import { useRecoilValue } from "recoil";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { erc20TokensState } from "@/modules/erc-tokens";
import { ERCTokenView } from "../home/ERCTokenView";
import { ropsten } from "@/web3-config";
import { minAbi } from "@/utils/erc20-abi";
import { EtherView } from "../home/EtherView";

interface ERCTokensBottomSheetProps {
    sheetRef: React.RefObject<BottomSheetModalMethods>
    onSelect: (props:{symbol:string, address: string | null}) => void
    walletAddress: string
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
        paddingHorizontal: 18
    },
    items: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 18,
        borderBottomColor: "#d2d3d4",
        borderBottomWidth: 1
    }
})

export const ERCTokensBottomSheet = ({sheetRef, onSelect, walletAddress}:ERCTokensBottomSheetProps) => {
    const snapPoints = useMemo(() => ['50%', '50%'], []);
    const tokens = useRecoilValue(erc20TokensState)
    const onSelectToken = useCallback((address: string | null) => () => {
        if(address){
            const contract = new ropsten.eth.Contract(minAbi, address);
            contract.methods.symbol().call().then((symbol:string) => onSelect({symbol, address}))
        }
        else {
            onSelect({
                symbol: 'ETH',
                address: null
            })
        }

        sheetRef.current?.close()
    }, [])

    if(!walletAddress)
        return null
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
                    children="토큰 목록"
                    margin={16}
                />
                {tokens.length ? (
                    <ScrollView style={styles.scrollView}>
                        <TouchableOpacity onPress={onSelectToken(null)}>
                            <EtherView walletAddress={walletAddress}/>
                        </TouchableOpacity>
                        {tokens.map((token, i) => (
                            <TouchableOpacity key={i} onPress={onSelectToken(token)}>
                                <ERCTokenView 
                                    tokenAddress={token}
                                    walletAddress={walletAddress}
                                />
                            </TouchableOpacity>
                        ))}
                        <Box padding={24} />
                    </ScrollView>
                ): (
                    <Box padding={18} alignItems="center">
                        <Typography 
                            style={fontfaces.P1}
                            children="등록된 토큰이 없습니다."
                        />
                        <Typography 
                            style={fontfaces.P1}
                            marginTop={6}
                            children="홈 화면에서 토큰을 등록해 주세요."
                        />
                    </Box>
                )}
            </Box>
        </BottomSheetModal>
    )
}