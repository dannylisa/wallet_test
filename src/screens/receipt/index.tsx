import { BackIcon, BlankIcon, fontfaces, HeaderBase, screenStyles, Typography } from "@/materials";
import { WithdrawParamList } from "@/navigation/bottom-tab/WithdrawNavigator";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView, View } from "react-native";


type WithdrawRouteProp = RouteProp<WithdrawParamList, 'withdraw/receipt'>

export function Receipt(){
    const {params:{receipt}} = useRoute<WithdrawRouteProp>()
    console.log(receipt)

    return (
        <SafeAreaView style={screenStyles.safeAreaView}>
            <View style={screenStyles.defaultScreen} >
                <HeaderBase>
                    <BackIcon/>
                    <Typography 
                        bold
                        style={fontfaces.P1}
                        children="출금 완료"
                    />
                    <BlankIcon />
                </HeaderBase>
            </View>
        </SafeAreaView>
    )
    
}