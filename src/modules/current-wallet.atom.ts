import { IStorageWallet } from "@/interface/storage-wallet.interface";
import { atom } from "recoil";

export const currentWalletState = atom<IStorageWallet | null>({
    key: 'current-wallet',
    default: null
})