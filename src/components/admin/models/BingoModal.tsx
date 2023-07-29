import { BingoDocType } from "@/lib/mongodb-schema";
import { UseStateProps } from "@/types/UseStateProps";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  UseDisclosureProps,
  layout,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_ROUTES } from "@/lib/constant";
import { updateBingo, uploadBingo } from "@/lib/firebase";

const BingoModal = ({
  handler,
  bingos,
  bingo,
}: {
  handler: UseDisclosureProps;
  bingos: BingoDocType[];
  bingo?: BingoDocType;
}) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [duplicate, setDuplicate] = useState<boolean>(false);

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
        <ModalHeader color={"black"}>
          {bingo ? "Update" : "Upload"} Bingo
        </ModalHeader>
        <ModalCloseButton />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(
              (d) => {
                setLoading(true);

                if (!bingo) {
                  uploadBingo(
                    d.title as string,
                    () => {
                      toast({
                        title: "Duplicate Entry",
                        description: "bingo already exists",
                        status: "error",
                      });
                      setLoading(false);
                    },
                    () => {
                      toast({
                        title: "uploaded",
                        status: "success",
                      });
                      reset();
                      if (handler.onClose) handler?.onClose();
                      setLoading(false);
                    },
                  );
                } else {
                  updateBingo(
                    (bingo as any).id,
                    d.title as string,
                    () => {
                      toast({
                        title: "Duplicate Entry",
                        description: "bingo already exists",
                        status: "error",
                      });
                      setLoading(false);
                    },
                    () => {
                      toast({
                        title: "uploaded",
                        status: "success",
                      });
                      reset();
                      if (handler.onClose) handler?.onClose();
                      setLoading(false);
                    },
                  );
                }
              },
              () => {
                setLoading(false);
              },
            )();
          }}
        >
          <ModalBody pb={1}>
            <FormControl isInvalid={errors.title !== undefined || duplicate}>
              <FormLabel color={"blackAlpha.900"}>Title</FormLabel>
              <Input
                placeholder="Title"
                defaultValue={bingo?.title || ""}
                {...register("title", {
                  required: {
                    value: true,
                    message: "bingo title required",
                  },
                  minLength: {
                    value: 1,
                    message: "title must be atleast 1 character long",
                  },
                  onChange: (e) => {
                    setDuplicate(
                      bingos.filter((b) => b.title === e.target.value).length >
                        0,
                    );
                  },
                })}
              />
              <FormErrorMessage>
                {duplicate && "bingo already exists\n"}
                {errors.title && (errors.title.message as string)}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} colorScheme="blue" type="submit" isLoading={loading}>
              {bingo ? "Update" : "Upload"}
            </Button>
            <Button onClick={handler.onClose} isLoading={loading}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default BingoModal;
