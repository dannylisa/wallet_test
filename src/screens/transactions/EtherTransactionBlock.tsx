import { ITransaction } from "@/interface/transaction.interface"
import { fontfaces, Typography } from "@/materials"
import { fAddress } from "@/utils/format-address"
import dayjs from "dayjs"
import React from "react"
import { StyleSheet, View } from "react-native"
import Web3 from "web3"

interface EtherTransactionBlockProps {
    address: string
    transaction: ITransaction
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomColor: "#d2d3d4",
        borderBottomWidth: 0.5,
    }
})


export const EtherTransactionBlock = ({transaction, address}:EtherTransactionBlockProps) => {
    const {from, to, value, timeStamp, input, gas, isError} = transaction
    const isWithdraw = from.toUpperCase() === address.toUpperCase()
    const color = isWithdraw ? "#FB334E" : "#2B88F7"
    const date = dayjs(+(timeStamp || 1)*1000).format('YYYY-MM-DD HH:mm:ss')

    if(+(isError || "1") || !(+value))
        return null;
    return (
        <View style={styles.container}>
            <Typography 
                style={fontfaces.P2}
                children={`${fAddress(isWithdraw ? to : from)}${isWithdraw ? "로 출금" : "로부터 입금"}`}
            />
            <Typography 
                style={fontfaces.D1}
                children={date}
            />
            <Typography 
                align="right"
                style={fontfaces.P1}
                color={color}
                children={`${isWithdraw ? "-" : "+"}${Web3.utils.fromWei(value, 'ether')} ETH`}
            />
        </View>
    )
}