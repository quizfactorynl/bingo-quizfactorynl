import { updateMusic, uploadMusic } from "@/lib/firebase";
import { MusicDocType } from "@/lib/mongodb-schema";
import { Drawer, DrawerBody, DrawerHeader, DrawerCloseButton, DrawerContent, DrawerOverlay, UseDisclosureProps 
 , FormControl, Input, FormLabel, Button, FormErrorMessage, Flex, Icon, Slide, ScaleFade, Fade
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import UploadForm from "./UploadForm";
import {FaFileCsv, FaWpforms } from "react-icons/fa";
import MusicForm from "./MusicForm";

export default function UploadNEditModel (
    {
        handler, editItem
    }: {
        handler: UseDisclosureProps, editItem?: MusicDocType
    }
) {
    
    const [uploadCSV, setUploadCSV] = useState<boolean>(false);

    return <Drawer onClose={handler.onClose || (()=>{})} isOpen={handler.isOpen || false} size={'full'}>
    <DrawerOverlay />
        <DrawerContent bg={'var(--bg-gradient)'}>
          <DrawerCloseButton />
          <DrawerHeader>{`${ editItem ? 'Edit' : 'Upload'} Music`}</DrawerHeader>
          <DrawerBody>
            {!editItem ? <>
                <Flex my={'1rem'} width={'100%'} >
                    <Button colorScheme={uploadCSV ? "green": "yellow"} size={'sm'} ml={'auto'} mr={'0.5rem'} onClick={()=>{
                        setUploadCSV(!uploadCSV)
                    }}>
                        <Icon fontSize={'2xl'}>
                            {uploadCSV ? 
                                <FaWpforms />:
                                <FaFileCsv />}
                        </Icon>
                    </Button>
                </Flex>
                {uploadCSV ? 
                    <Fade in={uploadCSV} >
                        <UploadForm onUpload={handler.onClose || (()=>{})} />
                    </Fade>
                    : 
                    <Fade in={!uploadCSV}>
                        <MusicForm onUpload={handler.onClose || (()=>{})} />
                </Fade>}
            </>
                : 
                <EditForm onUpload={handler.onClose || (()=>{})}  editItem={editItem}/>
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
                    /*
                        setLoading(false);
                        reset()
                        onUpload()
                    */
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





