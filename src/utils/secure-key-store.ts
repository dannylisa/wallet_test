import { openStdin } from 'process';
import * as Keychain from 'react-native-keychain';


// 데이터 저장
export const setKeychainItem = async (key: string, value: string, options?:Keychain.Options) => {
    await Keychain.setInternetCredentials(
        key,
        key,
        value,
        options
    )
}

// 데이터 조회
export const getKeychainItem = async (key: string) => {
    const result = await Keychain.getInternetCredentials(key);
    if(result)
        return result.password;
    else
        return null
}