
export type TransactionStatusType = 'error' | 'confirmation' | 'receipt' | 'transactionHash' | 'sent' | 'sending'
export interface ITransaction {
    status?: TransactionStatusType
    
    from: string
    to: string
    value: string
    nonce: number
    gasPrice: string

    gasLimit?: number
    hash?: string
    blockHash?: string
    blockNumber?: string
    timeStamp?: string
    transactionIndex?: string
    gas?: string
    isError?: string
    txreceipt_status?: string
    input?: string
    contractAddress?: string
    cumulativeGasUsed?: string
    gasUsed?: string
    confirmations?: string
    symbol?: string
}

export interface ITokenTransaction {
    "blockHash": string
    "blockNumber": string
    "confirmations": string
    "contractAddress": string
    "cumulativeGasUsed": string
    "from": string
    "gas": string
    "gasPrice": string
    "gasUsed": string
    "hash": string
    "input": string
    "nonce": string
    "timeStamp": string
    "to": string
    "tokenDecimal": string
    "tokenName": string
    "tokenSymbol": string
    "transactionIndex": string
    "value": string
}
