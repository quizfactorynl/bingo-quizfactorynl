import { musicsColRef } from "@/lib/firebase";
import { MusicDocType } from "@/lib/mongodb-schema";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  Center,
  Heading,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Button,
  Icon,
  useDisclosure,
  useMediaQuery,
  useToast,
  Input,
  Text
} from "@chakra-ui/react";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UseStateProps } from "@/types/UseStateProps";
import ConfirmationModal from "../design/models/ConfirmationModal";
import axios from "axios";
import { API_ROUTES } from "@/lib/constant";
import UploadNEditModel from "./UploadNEditModel";
import { BingoDocType } from "@/lib/firebase-docs-type";

export default function MusicList({
  musicState,
  bingo,
}: {
  musicState: UseStateProps<MusicDocType[]>;
  bingo: BingoDocType | null;
}) {
  const [musics, setMusics] = musicState as UseStateProps<MusicDocType[]>;

  const [editItem, setEditItem] = useState<MusicDocType | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isUnder600] = useMediaQuery("(max-width: 600px)");
  const [isUnder1000] = useMediaQuery("(max-width: 1000px)");

  const [deleteItem, setDeleteItem] = useState<MusicDocType | null>(null);
  const deleteModalHandle = useDisclosure();

  const [loader, setLoader] = useState<{
    loading: boolean;
    target_id: string | null;
  }>({
    loading: false,
    target_id: null,
  });

  const toast = useToast();

  const [filter, setFilter] = useState<string>("");

  if (!musics) return <></>;

  return (
    <Flex w={"100%"} p={isUnder600 ? "0.5rem" : "1rem"}>
      <Flex margin={"0 auto"} maxW={"1400px"} w={"100%"} flexDir={"column"}>
        <Center>
          <Heading fontSize={"xl"}>
            <Text display={'inline-block'} mr={'0.5rem'} color={'yellow'}>
              {bingo && bingo.title}
            </Text>   
            Music List
          </Heading>
        </Center>

        <Flex flexDir={'column'} my={'1rem'} gap={'0.5rem'}>
          <Text>Search Music</Text>
          <Input placeholder="Enter Music title or Artist name"
            value={filter} onChange={(e) => setFilter(e.target.value)}
          />  
        </Flex>
        <TableContainer
          my={"1rem"}
          rounded={"lg"}
          bg={"white"}
          shadow={"dark-lg"}
        >
          <Table
            variant="simple"
            style={{ tableLayout: isUnder1000 ? "initial" : "fixed" }}
            overflow={"visible"}
          >
            <Thead>
              <Tr>
                <Th>Music</Th>
                <Th>Artist</Th>
                <Th>Edit</Th>
              </Tr>
            </Thead>
            <Tbody>
              {musics
              .filter(m=> m.title.toLowerCase().includes(filter.toLowerCase()) || m.artist.toLowerCase().includes(filter.toLowerCase()))
              .map((music, i) => {
                return (
                  <Tr key={i}>
                    <Td>{music.title}</Td>
                    <Td>{music.artist}</Td>
                    <Td>
                      <Button
                        color={"blackAlpha.800"}
                        size={"sm"}
                        onClick={() => {
                          setEditItem(music);
                          onOpen();
                        }}
                        isLoading={
                          loader.target_id === music._id && loader.loading
                        }
                      >
                        <Icon as={EditIcon} className="inherit-parent-icon" />
                      </Button>
                      <Button
                        size={"sm"}
                        colorScheme="red"
                        mx={1}
                        onClick={() => {
                          setLoader({
                            target_id: music._id as string,
                            loading: false,
                          });
                          setDeleteItem(music);
                          deleteModalHandle.onOpen();
                        }}
                        isLoading={
                          loader.target_id === music._id && loader.loading
                        }
                      >
                        <DeleteIcon />
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      <ConfirmationModal
        isOpen={deleteModalHandle.isOpen}
        onClose={deleteModalHandle.onClose}
        message={`Are you sure you want to delete '${
          deleteItem?.title || ""
        }' music?`}
        onYes={() => {
          if (!deleteItem) return;
          setLoader((prev) => {
            return {
              ...prev,
              loading: true,
            };
          });
          axios
            .delete(`${API_ROUTES.MUSICS}/${deleteItem._id}`)
            .then((res) => {
              console.log(res.data);
              if (res.data.acknowledged) {
                setMusics((prev) => {
                  return prev.filter((music) => music._id !== deleteItem._id);
                });
              }
              setLoader((prev) => {
                return {
                  ...prev,
                  loading: false,
                };
              });
            })
            .catch((err) => {
              toast({
                title: "Error",
                description: err.response.message || "Unknown error occurred",
                status: "error",
              });
              setLoader((prev) => {
                return {
                  ...prev,
                  loading: false,
                };
              });
            });
          deleteModalHandle.onClose();
        }}
      />
      <UploadNEditModel
        handler={{ isOpen, onClose, onOpen }}
        editItem={editItem as MusicDocType}
      />
    </Flex>
  );
}
