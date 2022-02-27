import React, { useMemo } from "react"
import { Box, Button, fontfaces, PRIMARY } from "@/materials";
import { Typography } from "@/materials/Typography";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mnemonicContainer: {
        marginTop: 12,
        borderRadius: 5,
    },
    mnemonicItem: {
        width: 120,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: PRIMARY,
        borderRadius: 4,
        marginTop: 12,
    }
})

interface GenerateMnemonicProps {
    mnemonic: string
    onNext: () => void
}

export const GenerateMnemonic = ({onNext, mnemonic}: GenerateMnemonicProps) => {
    const mnemonics = useMemo(() => mnemonic.split(' '), [mnemonic])

    return(
       <Box justifyContent="space-between" flex={1}>
           <Box marginBottom={36}>
                <Typography style={fontfaces.H2} children="계정 시드 구문 기록" />
                <Typography 
                    style={fontfaces.D1} 
                    marginTop={4}
                    children="계정 시드 구문을 메모지에 적어 안전한 장소에 보관하세요." 
                />

                <Box
                    flexDirection="row" 
                    justifyContent="space-evenly"
                    style={styles.mnemonicContainer}
                >
                    <Box>
                        {/* 홀수 번호 */}
                        {mnemonics
                            .filter((_, i) => !(i & 1))
                            .map((mn, i) => (
                                <Typography 
                                    key={mn}
                                    align="center"
                                    style={[fontfaces.P1, styles.mnemonicItem]}
                                    children={`${i*2+1}. ${mn}`}
                                />
                            ))
                        }
                    </Box>
                    <Box>
                        {/* 짝수 번호 */}
                        {mnemonics
                            .filter((_, i) => i & 1)
                            .map((mn, i) => (
                                <Typography 
                                    key={mn}
                                    align="center"
                                    style={[fontfaces.P1, styles.mnemonicItem]}
                                    children={`${i*2+2}. ${mn}`}
                                />
                            ))
                        }
                    </Box>

                </Box>
           </Box>

           <Button
                type="primary"
                children={mnemonics.length ? "다음" : "암호 생성하기"}
                onPress={onNext}
           />
       </Box>
    )
}