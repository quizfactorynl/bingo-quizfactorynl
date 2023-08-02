import { Button, Flex, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ErrorPanel({
  errorType,
}: {
  errorType: "client" | "admin";
}) {
  const router = useRouter();

  return (
    <Flex
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
      gap={4}
    >
      <Text color={"red.400"} fontSize={"2xl"}>
        <WarningIcon mx={2} className="inherit-parent-icon" />
        Some thing Went Wrong
      </Text>
      <Button
        size={"sm"}
        colorScheme="yellow"
        color={"white"}
        onClick={() => {
          router.push(errorType === "client" ? "/" : "/login");
        }}
      >
        {errorType == "client" ? "Go Home" : "Go to login"}
      </Button>
    </Flex>
  );
}
