import { Flex, PinInput, PinInputField } from "@chakra-ui/react";

export default function VerificationCodeInput() {

  return (
    <Flex gap={"0.5rem"}>
      <PinInput size={'lg'} placeholder="" autoFocus={true} onChange={(e)=> console.log(e)}>
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      <PinInputField bg={'white'} color={'blackAlpha.900'}/>
      </PinInput>
    </Flex>
  );
}
