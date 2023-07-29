import { Flex } from "@chakra-ui/react";

export default function WaveyBg() {
  return (
    <Flex width="100%" height="100%" bg="white" flexDir="column"> {/* Set a fixed height */}
      
      {/* <Flex height={'10rem'}>

      <Flex
        width="100%"
        aspectRatio={960 / 200}
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundImage="url(/Images/upper-wave.svg)"
        border="1px solid red"
        flex={1}
        ></Flex>
        </Flex> */}
      <Flex color="black">hello world</Flex>
    </Flex>
  );
}
