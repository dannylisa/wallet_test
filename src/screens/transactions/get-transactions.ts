
import { ropsten } from "@/web3-config";
import { Transaction } from "web3-eth";

export const getBlockNumber = async () => {
    return new Promise<number>(resolve => {
        ropsten.eth.getBlockNumber((err, blockNumber) => resolve(blockNumber))
    })
}

export interface GetTransactionsResult {
    nextEndBlockNumber: number,
    transactions: Transaction[]
}


export async function getTransactionsByAccount (account:string, endBlockNumber:number): Promise<GetTransactionsResult> {
    const startBlockNumber = endBlockNumber - 200;
    const targetTransactions:Transaction[] = [];
    for(let i = endBlockNumber; i >= startBlockNumber; i--){
        const block = await ropsten.eth.getBlock(i)
        for (const transaction of block.transactions) {
            const tx = await ropsten.eth.getTransaction(transaction)
            if(tx.from === account || tx.to === account){
                targetTransactions.push(tx)
                console.log(tx)
            }
        }
    }

    return {
        nextEndBlockNumber: startBlockNumber-1,
        transactions: targetTransactions
    }
  }