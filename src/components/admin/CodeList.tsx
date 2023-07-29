import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { RefCodeDocType } from "@/lib/firebase-docs-type";
import { FaTrash } from "react-icons/fa";
import ConfirmationModal from "../design/models/ConfirmationModal";
import { deleteRefCode } from "@/lib/firebase";
import { useState } from "react";

export default function CodeList({ codes }: { codes: RefCodeDocType[] }) {
  const [isUnder600] = useMediaQuery("(max-width: 500px)");

  return (
    <Flex p={isUnder600 ? 2 : 10} width={"100%"} height={"100%"}>
      <Flex
        flexDirection={"column"}
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={isUnder600 ? 2 : 4}
        maxW={"1400px"}
        margin={"0 auto"}
      >
        {codes.length === 0 && "No reference code found"}
        <Flex
          width={"100%"}
          bg={"white"}
          rounded={"lg"}
          p={2}
          flexWrap="wrap"
          shadow={"dark-lg"}
        >
          {codes.map((code, idx) => {
            return <CodeCard key={idx} code={code} />;
          })}
        </Flex>
      </Flex>
    </Flex>
  );
}
const CodeCard = ({ code }: { code: RefCodeDocType }) => {
  const deleteModelHandler = useDisclosure();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <ConfirmationModal
        isOpen={deleteModelHandler.isOpen}
        onClose={deleteModelHandler.onClose}
        message={`Are you sure to delete reference code '${code.code}'?`}
        onYes={() => {
          setLoading(true);
          deleteRefCode(code.id)
            .then(() => {
              setLoading(false);
              deleteModelHandler.onClose();
            })
            .catch((err) => {
              setLoading(false);
              toast({
                title: "Error",
                description: "Failed to delete reference code",
                status: "error",
              });
            });
        }}
      />
      <Box
        border={"1px solid blackAlpha.400"}
        color={"blackAlpha.900"}
        flex={1}
        width={{
          base: "100%",
          sm: "calc(50% - 8px)",
          md: "calc(33.333% - 12px)",
        }}
        p={4}
        boxShadow={"md"}
        borderRadius={"md"}
        my={2}
        mx={1}
        display="flex"
        alignItems="center"
        _hover={{
          cursor: "pointer",
          shadow: "lg",
          border: "1px solid blackAlpha.600",
        }}
      >
        <IconButton
          isLoading={loading}
          aria-label="Delete"
          icon={<FaTrash />}
          colorScheme="red"
          size="sm"
          mr={2}
          // Add your delete logic here
          onClick={() => deleteModelHandler.onOpen()}
        />
        <Box flex={1} textAlign={"center"}>
          <Box fontSize={"sm"} fontWeight={"light"} color={"blackAlpha.900"}>
            {code.bingo_name || ""}
          </Box>
          <Box
            fontSize={"md"}
            color={"gray.500"}
            onClick={(e) => {
              e.stopPropagation();
              window.navigator.clipboard.writeText(code.code);
              toast({
                title: "Copied",
                description: "Reference code copied",
                status: "success",
              });
            }}
          >
            {code.code}
          </Box>
        </Box>
      </Box>
    </>
  );
};
