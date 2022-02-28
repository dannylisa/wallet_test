import { IStorageWallet } from "@/interface/storage-wallet.interface";
import { atom } from "recoil";

export const myWalletsState = atom<IStorageWallet[]>({
    key: 'my-wallets',
    default: []
})