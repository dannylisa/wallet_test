import { atom, useSetRecoilState } from "recoil";
import { ITransaction, TransactionStatusType } from "interface/transaction.interface"


export const currrentTransactionsState = atom<(ITransaction & {id: number})[]>({
    key: 'current/transaction',
    default: []
})

export const useCurrentTransaction = () => {
    const setTransaction = useSetRecoilState(currrentTransactionsState)
    const addTransaction = ( id: number, tx:ITransaction ) => {
        setTransaction(prev => [{id, ...tx}, ...prev])
    }
    const changeTransactionStatus = (id: number, status:TransactionStatusType) => {
        setTransaction(prev => {
            const targetTxIndex = prev.findIndex(tx => tx.id === id)
            if(targetTxIndex === -1)
                return prev;
            
            // 최신화된 tx는 맨 앞으로
            return [
                {...prev[targetTxIndex], status},
                ...prev.slice(0, targetTxIndex),
                ...prev.slice(targetTxIndex+1)
            ]
        })
    }

    const setTransactionHash = (id:number, txHash: string) => {
        setTransaction(prev => {
            const targetTxIndex = prev.findIndex(tx => tx.id === id)
            if(targetTxIndex === -1)
                return prev;
            
            // 최신화된 tx는 맨 앞으로
            return [
                {...prev[targetTxIndex], status:'transactionHash', hash: txHash},
                ...prev.slice(0, targetTxIndex),
                ...prev.slice(targetTxIndex+1)
            ]
        })
    }

    const setTerminalTransaction = (id: number, status: 'error' | 'confirmation') => {
        changeTransactionStatus(id, status)
    
        // 2분 후 거래 내역 삭제 (etherscan 거래 내역에서 확인 가능)
        setTimeout(() => setTransaction(prev => {
            const targetTxIndex = prev.findIndex(tx => tx.id === id)
            if(targetTxIndex === -1)
                return prev;

            return prev
                .slice(0, targetTxIndex)
                .concat(prev.slice(targetTxIndex+1))
        }), 2*60*1000)
    }
    return {
        addTransaction,
        setTransactionHash,
        changeTransactionStatus,
        setTerminalTransaction
    }
}