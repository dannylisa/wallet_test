
import { web3 } from "@/web3-config";
import { Transaction } from "web3-eth";

export const getBlockNumber = async () => {
    return new Promise<number>(resolve => {
        web3.eth.getBlockNumber((err, blockNumber) => resolve(blockNumber))
    })
}

export interface GetTransactionsResult {
    nextEndBlockNumber: number,
    transactions: Transaction[]
}


export async function getTransactionsByAccount (account:string, endBlockNumber:number): Promise<GetTransactionsResult> {
    const startBlockNumber = endBlockNumber - 200;

    const blockNumberArray = new Array(endBlockNumber - startBlockNumber).fill(0).map((_,i) => startBlockNumber+i)
    const targetTransactions:Transaction[] = [];
    await Promise.all(
        blockNumberArray.map(async (blockNo) => {
            const block = await web3.eth.getBlock(blockNo)
            for (const transaction of block.transactions) {
                const tx = await web3.eth.getTransaction(transaction)
                if(tx.from === account || tx.to === account)
                    targetTransactions.push(tx)
            }
        })
    )
    return {
        nextEndBlockNumber: startBlockNumber-1,
        transactions: targetTransactions
    }
  }