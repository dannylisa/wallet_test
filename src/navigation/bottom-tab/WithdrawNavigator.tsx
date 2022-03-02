import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { TransactionReceipt } from 'web3-core'
import { Withdraw } from "@screens/withdraw"
import { Receipt } from "@screens/receipt"

export interface ReceiptParams {
    // 새로운 포스트의 id값
    receipt: TransactionReceipt
}


export type WithdrawParamList = {
    "withdraw/main": undefined
    "withdraw/receipt": ReceiptParams
}

const WithdrawStack = createStackNavigator<WithdrawParamList>()

export default function WithdrawNavigator(){
    return (
        <WithdrawStack.Navigator >
            <WithdrawStack.Screen
                name="withdraw/main"
                component={Withdraw}
                options={{
                    headerShown:false,
                    headerTitle:'출금'
                }}
            />
            <WithdrawStack.Screen
                name="withdraw/receipt"
                component={Receipt}
                options={{
                    headerShown:false,
                    headerTitle:'출금 결과'
                }}
            />
        </WithdrawStack.Navigator>
    )
}