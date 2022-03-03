import { atom } from "recoil";

export const erc20TokensState = atom<string[]>({
    key: 'tokens/erc20',
    default: []
})