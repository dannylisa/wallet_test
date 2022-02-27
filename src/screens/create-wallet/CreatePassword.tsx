import React, { useState } from "react";
import { Box, Button, fontfaces, TextInput } from "@/materials";
import { Typography } from "@/materials/Typography";

interface CreatePasswordProps {
    onNext: (password: string) => void
}
export default function CreatePassword({onNext}:CreatePasswordProps){
    const [pwd, setPwd] = useState<string>("")
    const [pwd2, setPwd2] = useState<string>("")
    const pwdValidator = (pwd:string) => pwd.length>7;
    const pwd2Validator = (pwd2:string) => pwd2 === pwd;
    const toNext = () => onNext(pwd)

    return (
        <Box justifyContent="space-between" flex={1}>
            <Box marginBottom={24}>
                <Typography style={fontfaces.H2} children="암호 생성" />
                <Typography style={fontfaces.P1} children="새 암호" marginTop={24} />
                <TextInput
                    secureTextEntry
                    placeholder="8자리 이상 입력해 주세요."
                    value={pwd}
                    onChangeText={setPwd}
                    validator={pwdValidator}
                    message="8자리 이상 입력해 주세요."
                />
                <Typography style={fontfaces.P1} children="암호 확인" marginTop={24} />
                <TextInput
                    secureTextEntry
                    placeholder="암호를 다시 한 번 확인해 주세요."
                    value={pwd2}
                    onChangeText={setPwd2}
                    validator={pwd2Validator}
                    message="암호를 다시 확인해 주세요."
                />
            </Box>
            <Button
                type="primary"
                children={"다음"}
                onPress={toNext}
                disabled={(pwd.length < 8) || (pwd !== pwd2)}
            />
        </Box>
    )
}