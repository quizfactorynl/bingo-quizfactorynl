import { updateMusic, uploadMusic } from "@/lib/firebase";
import { MusicDocType } from "@/lib/firebase-docs-type";
import { Drawer, DrawerBody, DrawerHeader, DrawerCloseButton, DrawerContent, DrawerOverlay, UseDisclosureProps 
 , FormControl, Input, FormLabel, Button, FormErrorMessage
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import UploadForm from "./UploadForm";

export default function UploadNEditModel (
    { handler, editItem }: { handler: UseDisclosureProps, editItem?: MusicDocType  }
) {
    return <Drawer onClose={handler.onClose || (()=>{})} isOpen={handler.isOpen || false} size={'full'}>
    <DrawerOverlay />
        <DrawerContent bg={'var(--bg-gradient)'}>
          <DrawerCloseButton />
          <DrawerHeader>{`${ editItem ? 'Edit' : 'Upload'} Music`}</DrawerHeader>
          <DrawerBody>
            {!editItem ? 
                <UploadForm onUpload={handler.onClose || (()=>{})} /> : 
                <UploadForm onUpload={handler.onClose || (()=>{})} />
            }
          </DrawerBody>
        </DrawerContent>
    </Drawer>
}

const EditForm = (
    { onUpload, editItem } : {  onUpload: ()=> void, editItem: MusicDocType }
)=> {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm();

    const [loading, setLoading] = useState<boolean>(false);

    return <form style={{ display:'flex', flexDirection: 'column', gap: '1rem'}}
        onSubmit={(e)=> {
            e.preventDefault()

            if(loading) return;

            setLoading(true);
            handleSubmit((d)=> {
                    updateMusic(editItem.id, d.songName, d.artistName).then(()=> {
                        setLoading(false);
                        reset()
                        onUpload()
                    });
            }, (_)=> {
                setLoading(false);
            })();
        }}
    >
        <FormControl isInvalid={errors.songName != undefined} >
            <FormLabel>Enter Song Name</FormLabel>
            <Input placeholder="song name"
                shadow={'dark-lg'}
                defaultValue={editItem?.title || ''}
                {...register("songName", { 
                    required: {
                        value: true,
                        message: "Song name required"
                    },
                    minLength: {
                        value: 1,
                        message: "song name must be atleast 1 character long"
                    }
                })}
            />
            {errors.songName && <FormErrorMessage color={'red.200'}>{errors.songName?.message as string}</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={errors.artistName != undefined}>
            <FormLabel>Enter Artist Name</FormLabel>
            <Input placeholder="artist name" shadow={'dark-lg'}
                defaultValue={editItem?.artist || ''}
                {...register("artistName", { 
                    required: {
                        value: true,
                        message: "artist name name required"
                    },
                    minLength: {
                        value: 1,
                        message: "artist name must be atleast 1 character long"
                    }
                })}
            />
            {errors.artistName && <FormErrorMessage color={'red.200'}>{errors.artistName?.message as string}</FormErrorMessage>}
        </FormControl>    

        <center>
            <Button colorScheme="yellow" color={'white'} type="submit" isLoading={loading}>
                { editItem ? 'Update' : 'Upload'}
            </Button>
            <Button colorScheme="red" ml={'0.5rem'} onClick={()=> onUpload()} isDisabled={loading}>
                Cancel
            </Button>
        </center>
    </form> 
}




