import { ITransaction } from '@/interface/transaction.interface'
import axios from 'axios'
import Config from 'react-native-config'

interface GetTransactionsAPIResult {
    status: string
    message: string
    result: ITransaction[]
}

const API_KEY = Config.ETHERSCAN_API_KEY_TOKEN
export const getTokenTransactions = (address:string, contractAddress: string, page: number, offset: number) => {

    return axios.get<GetTransactionsAPIResult>(
        'https://api-ropsten.etherscan.io/api',
        {params:{
            module: 'account',
            action: "tokentx",
            address,
            contractAddress,
            startblock: "0",
            endblock: "99999999",
            page: ""+page,
            offset: ""+offset,
            sort: "desc",
            apikey: API_KEY
        }}
    )
}