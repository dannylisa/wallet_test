
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
}