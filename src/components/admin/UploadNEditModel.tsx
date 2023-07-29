import { updateMusic, uploadMusic } from "@/lib/firebase";
import { MusicDocType } from "@/lib/mongodb-schema";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  UseDisclosureProps,
  FormControl,
  Input,
  FormLabel,
  Button,
  FormErrorMessage,
  Flex,
  Icon,
  Slide,
  ScaleFade,
  Fade,
  useToast,
} from "@chakra-ui/react";
import { use, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import UploadForm from "./UploadForm";
import { FaFileCsv, FaWpforms } from "react-icons/fa";
import MusicForm from "./MusicForm";
import MusicContext from "@/hooks/MusicContext";
import axios from "axios";
import { API_ROUTES } from "@/lib/constant";

export default function UploadNEditModel({
  handler,
  editItem,
}: {
  handler: UseDisclosureProps;
  editItem?: MusicDocType;
}) {
  const [uploadCSV, setUploadCSV] = useState<boolean>(false);

  return (
    <Drawer
      onClose={handler.onClose || (() => {})}
      isOpen={handler.isOpen || false}
      size={"full"}
    >
      <DrawerOverlay />
      <DrawerContent bg={"var(--bg-gradient)"}>
        <DrawerCloseButton />
        <DrawerHeader>{`${editItem ? "Edit" : "Upload"} Music`}</DrawerHeader>
        <DrawerBody>
          {!editItem ? (
            <>
              <Flex my={"1rem"} width={"100%"}>
                <Button
                  colorScheme={uploadCSV ? "green" : "yellow"}
                  size={"sm"}
                  ml={"auto"}
                  mr={"0.5rem"}
                  onClick={() => {
                    setUploadCSV(!uploadCSV);
                  }}
                >
                  <Icon fontSize={"2xl"}>
                    {uploadCSV ? <FaWpforms /> : <FaFileCsv />}
                  </Icon>
                </Button>
              </Flex>
              {uploadCSV ? (
                <Fade in={uploadCSV}>
                  <UploadForm onUpload={handler.onClose || (() => {})} />
                </Fade>
              ) : (
                <Fade in={!uploadCSV}>
                  <MusicForm onUpload={handler.onClose || (() => {})} />
                </Fade>
              )}
            </>
          ) : (
            <EditForm
              onUpload={handler.onClose || (() => {})}
              editItem={editItem}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

const EditForm = ({
  onUpload,
  editItem,
}: {
  onUpload: () => void;
  editItem: MusicDocType;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const musicContext = useContext(MusicContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [duplicate, setDuplicate] = useState<boolean>(false);

  const toast = useToast();

  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      onSubmit={(e) => {
        e.preventDefault();
        if (loading) return;

        handleSubmit(
          (d) => {
            let isDuplicate =
              musicContext.state[0].filter((i) => {
                return i.title == d.title && i.artist == d.artist;
              }).length > 0;

            setDuplicate(isDuplicate);
            if (isDuplicate) {
              return;
            }

            setLoading(true);

            axios
              .patch(`${API_ROUTES.MUSICS}/${editItem._id}`, {
                title: d.title,
                artist: d.artist,
                bingo_id: editItem.bingo_id,
              } as MusicDocType)
              .then((res) => {
                console.log(res.data);
                if (res.data.acknowledged) {
                  // update entry
                  musicContext.state[1]((prev) => {
                    return prev.map((i) => {
                      if (i._id == editItem._id) {
                        return {
                          ...i,
                          title: d.title,
                          artist: d.artist,
                        };
                      }
                      return i;
                    });
                  });
                  toast({
                    title: "Success",
                    description: "Music Updated",
                    status: "success",
                  });
                }

                setLoading(false);
                onUpload();
              })
              .catch((err) => {
                setLoading(false);
                toast({
                  title: "Error",
                  description: "An Error Occur" + err.message,
                  status: "error",
                });
              });
          },
          (_) => {
            setLoading(false);
          },
        )();
      }}
    >
      <FormControl isInvalid={errors.title != undefined || duplicate}>
        <FormLabel>Enter Song Name</FormLabel>
        <Input
          placeholder="song name"
          shadow={"dark-lg"}
          defaultValue={editItem?.title || ""}
          {...register("title", {
            required: {
              value: true,
              message: "Song name required",
            },
            minLength: {
              value: 1,
              message: "song name must be atleast 1 character long",
            },
          })}
        />

        <FormErrorMessage color={"red.200"}>
          {duplicate ? "Duplicate Entry" : ""}
          <br />
          {errors.title && (errors.title?.message as string)}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.artist != undefined || duplicate}>
        <FormLabel>Enter Artist Name</FormLabel>
        <Input
          placeholder="artist name"
          shadow={"dark-lg"}
          defaultValue={editItem?.artist || ""}
          {...register("artist", {
            required: {
              value: true,
              message: "artist name name required",
            },
            minLength: {
              value: 1,
              message: "artist name must be atleast 1 character long",
            },
          })}
        />
        <FormErrorMessage color={"red.200"}>
          {duplicate ? "Duplicate Entry" : ""}
          <br />
          {errors.artist && (errors.artist?.message as string)}
        </FormErrorMessage>
      </FormControl>

      <center>
        <Button
          colorScheme="yellow"
          color={"white"}
          type="submit"
          isLoading={loading}
        >
          {editItem ? "Update" : "Upload"}
        </Button>
        <Button
          colorScheme="red"
          ml={"0.5rem"}
          onClick={() => onUpload()}
          isDisabled={loading}
        >
          Cancel
        </Button>
      </center>
    </form>
  );
};
