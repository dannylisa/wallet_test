import lightwallet from 'eth-lightwallet'

const createVault = async (password:string, mnemonic:string) => {
    return new Promise<lightwallet.keystore>((resolve) => {
        lightwallet.keystore.createVault({
            password,
            seedPhrase: mnemonic,
            hdPathString : "m/0'/0'/0'"
        }, (err, keystore) => resolve(keystore))
    })
}

const keyFromPassword = async (keystore: lightwallet.keystore, password: string) => {
    return new Promise<Uint8Array>((resolve) => {
        keystore.keyFromPassword(password, (err, pwDerivedkey) => resolve(pwDerivedkey))
    })
}
export const createWalletKeystore = async (mnemonic: string, password: string) => {
    const keystore = await createVault(password, mnemonic)
    const pwDerivedkey = await keyFromPassword(keystore, password)

    keystore.generateNewAddress(pwDerivedkey, 1)
    const address = keystore.getAddresses()[0]
    const privateKey = keystore.exportPrivateKey(address, pwDerivedkey)

    return {
        address,
        privateKey
    }
}