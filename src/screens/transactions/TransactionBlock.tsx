import { ITransaction } from "@/interface/transaction.interface"
import { Box, fontfaces, Typography } from "@/materials"
import { fAddress } from "@/utils/format-address"
import { web3 } from "@/web3-config"
import dayjs from "dayjs"
import React from "react"
import { StyleSheet, View } from "react-native"
import Web3 from "web3"

interface TransactionBlockProps {
    address: string
    transaction: ITransaction
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomColor: "#d2d3d4",
        borderBottomWidth: 1,
    }
})


export const TransactionBlock = ({transaction:{from, to, value, timeStamp}, address}:TransactionBlockProps) => {
    const isWithdraw = from === address
    const color = isWithdraw ? "#FB334E" : "#2B88F7"
    const date = dayjs((+timeStamp)*1000).format('YYYY-MM-DD HH:mm:ss')

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