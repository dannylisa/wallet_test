import { setKeychainItem } from "@/utils/secure-key-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setGenericPassword, ACCESSIBLE, ACCESS_CONTROL, AUTHENTICATION_TYPE } from 'react-native-keychain';

export const saveWalletToAsyncStorage = async (address: string, password: string, privateKey: string) => {
    try {
        // 기존 지갑 목록 정보 가져오기
        const walletsInStorage = await AsyncStorage.getItem('WALLETS')
        const wallets = walletsInStorage ? JSON.parse(walletsInStorage) : [];
        // 기존 지갑 목록에 추가하기
        wallets.push({
            address: address,
            createdAt: new Date().getTime(),
        });

        // 지갑 목록 정보 저장하기
        await AsyncStorage.setItem('WALLETS', JSON.stringify(wallets));
        
        // 개인키를 안전한 영역에 저장
        setKeychainItem(
            address, 
            privateKey, 
            {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY}
        )
        
        // 로컬 비밀번호 저장
        setGenericPassword(
            address, 
            password, 
            {
                accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE, 
                accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY, 
                authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS
            }
        )


      } catch (error) {
        // Error saving data
        console.log(error);
      }
}