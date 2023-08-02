import { Flex, Text, Spinner } from "@chakra-ui/react";

export default function Loader() {
  return (
    <Flex
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
      gap={4}
    >
      <Spinner size="xl" />
      <Text>De juiste noten bij elkaar zoeken...</Text>
    </Flex>
  );
}
