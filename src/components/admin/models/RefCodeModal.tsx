import VerificationCodeInput from "@/components/design/VerificationCodeInput";
import { uploadRefCode } from "@/lib/firebase";
import { BingoDocType, RefCodeDocType } from "@/lib/firebase-docs-type";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseDisclosureProps,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const RefCodeModal = ({
  handler,
  bingos,
  codes,
}: {
  handler: UseDisclosureProps;
  bingos: BingoDocType[];
  codes: RefCodeDocType[];
}) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [duplicate, setDuplicate] = useState<boolean>(false);

  const [input, setInput] = useState({
    code: "",
    bingo_name: "",
    bingo_id: "",
    errors: {},
  });

  const resetInput = () => {
    setInput({
      code: "",
      bingo_name: "",
      bingo_id: "",
      errors: {},
    });
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={handler.isOpen as boolean}
      onClose={handler.onClose as () => void}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={"black"}>Generate Reference Code</ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const errors = {
              code:
                input.code.length != 5
                  ? {
                      message: "Code must be 5 characters",
                    }
                  : undefined,
              bingo_name:
                input.bingo_name.length == 0
                  ? {
                      message: "Select Bingo",
                    }
                  : undefined,
            };

            setInput((prev) => {
              return {
                ...prev,
                errors,
              };
            });

            if (errors.code || errors.bingo_name || duplicate) return;

            setLoading(true);
            uploadRefCode(
              input.code,
              input.bingo_id,
              () => {
                toast({
                  title: "Success",
                  description: "Reference code generated",
                  status: "success",
                });

                if (handler.onClose) {
                  handler.onClose();
                }
                resetInput();
                setLoading(false);
              },
              (reason) => {
                toast({
                  title: "Error",
                  description: reason,
                  status: "error",
                });
                setLoading(false);
              },
            );
          }}
        >
          <ModalBody pb={1} justifyContent={"center"} alignItems={"center"}>
            <FormControl
              isInvalid={duplicate || (input.errors as any).code != undefined}
              width={"100%"}
              justifyContent={"center"}
            >
              <FormLabel color={"blackAlpha.900"}>Code</FormLabel>

              <VerificationCodeInput
                inputProps={{
                  value: input.code,
                  onChange: (e) => {
                    setDuplicate(
                      codes.find((code) => code.code == e) != undefined,
                    );
                    setInput((prev) => {
                      return {
                        ...prev,
                        code: e + "",
                      };
                    });
                  },
                }}
              />

              <FormErrorMessage>
                {duplicate && "bingo already exists\n"}
                {(input.errors as any).code &&
                  ((input.errors as any).code.message as string)}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={(input.errors as any).bingo_name != undefined}
              width={"100%"}
              justifyContent={"center"}
              mt={"2rem"}
            >
              <FormLabel color={"blackAlpha.900"}>Bingo</FormLabel>

              <Menu colorScheme="blue">
                <MenuButton
                  as={Button}
                  colorScheme="blue"
                  rightIcon={<ChevronDownIcon />}
                >
                  {input.bingo_name ? input.bingo_name : "Select Bingo"}
                </MenuButton>
                <MenuList color={"blackAlpha.900"}>
                  {bingos.map((bingo, idx) => {
                    return (
                      <MenuItem
                        key={idx}
                        _hover={{
                          bg: "blue.600",
                          color: "white",
                        }}
                        value={bingo.id}
                        onClick={() => {
                          setInput((prev) => {
                            return {
                              ...prev,
                              bingo_name: bingo.title,
                              bingo_id: bingo.id,
                            };
                          });
                        }}
                      >
                        {bingo.title}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>

              <FormErrorMessage>
                {duplicate && "bingo already exists\n"}
                {(input.errors as any).bingo_name &&
                  ((input.errors as any).bingo_name.message as string)}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} colorScheme="blue" type="submit" isLoading={loading}>
              Generate
            </Button>
            <Button
              onClick={() => {
                resetInput();
                if (handler.onClose) handler.onClose();
              }}
              isLoading={loading}
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default RefCodeModal;
