import Web3 from "web3";

const ROPSTEN_TESTNET = 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
export const web3 = new Web3(new Web3.providers.HttpProvider(ROPSTEN_TESTNET));