import { Flex, PinInput, PinInputField, PinInputProps } from "@chakra-ui/react";

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VerificationCodeInput({ 
  inputProps
}: {
  inputProps?: VerificationCodeInputProps
}) {
  
  return (
    <Flex gap={"0.5rem"}>
      <PinInput {...inputProps} size={'lg'} placeholder="" autoFocus={true}  >
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      </PinInput>
    </Flex>
  );
}

