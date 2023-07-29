import { MusicDocType } from "@/lib/mongodb-schema";
import { UseStateProps } from "@/types/UseStateProps";
import { WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import MusicListPreview from "./MusicListPreview";
import axios from "axios";
import { API_ROUTES } from "@/lib/constant";
import MusicContext from "@/hooks/MusicContext";

export default function MusicForm({ onUpload }: { onUpload: () => void }) {
  const musicContext = useContext(MusicContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [duplicate, setDuplicate] = useState<boolean>(false);
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      onSubmit={(e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        handleSubmit(
          (d) => {
            let isDuplicateEntry =
              musicContext.state[0].filter((m) => {
                return m.title == d.title && m.artist == d.artistName;
              }).length > 0;

            setDuplicate(isDuplicateEntry);
            if (isDuplicateEntry) {
              setLoading(false);
              return;
            }

            const data: MusicDocType = {
              title: d.title,
              artist: d.artistName,
              bingo_id: musicContext.id,
            };

            axios
              .post(`${API_ROUTES.MUSICS}/${musicContext.id}`, data)
              .then((res) => {
                if (res.data.acknowledged) {
                  toast({
                    title: "Music Added.",
                    description: "Music has been added to the bingo.",
                    status: "success",
                  });

                  musicContext.state[1]((prev) => {
                    prev.push({
                      _id: res.data.insertedId,
                      ...data,
                    });
                    return prev;
                  });

                  reset();
                  onUpload();
                }

                setLoading(false);
              })
              .catch((err) => {
                toast({
                  title: "Error",
                  description: "An error occur while adding music.",
                  status: "error",
                });
                setLoading(false);
              });
          },
          (_) => {
            setLoading(false);
          },
        )();
      }}
    >
      <FormControl isInvalid={errors.title != undefined || duplicate}>
        <FormLabel>Enter Music Title</FormLabel>
        <Input
          placeholder="music title"
          shadow={"dark-lg"}
          {...register("title", {
            required: {
              value: true,
              message: "title required",
            },
            minLength: {
              value: 1,
              message: "song name must be atleast 1 character long",
            },
          })}
        />
        <FormErrorMessage color={"red.200"}>
          {duplicate && "Duplicate entry \n"} <br />
          {errors.title && (errors.title?.message as string)}
        </FormErrorMessage>
      </FormControl>

      {/* preview */}

      <FormControl isInvalid={errors.artistName != undefined || duplicate}>
        <FormLabel>Enter Artist Name</FormLabel>
        <Input
          placeholder="artist name"
          shadow={"dark-lg"}
          {...register("artistName", {
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
          {duplicate && "Duplicate entry \n"} <br />
          {errors.artistName && (errors.artistName?.message as string)}
        </FormErrorMessage>
      </FormControl>

      <center>
        <Button
          colorScheme="yellow"
          color={"white"}
          type="submit"
          isLoading={loading}
        >
          Upload
        </Button>
        <Button
          colorScheme="red"
          ml={"0.5rem"}
          isDisabled={loading}
          onClick={() => {
            onUpload();
          }}
        >
          Cancel
        </Button>
      </center>
    </form>
  );
}
