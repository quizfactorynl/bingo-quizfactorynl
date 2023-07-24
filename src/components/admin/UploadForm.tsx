import { uploadMusic } from "@/lib/firebase";
import { Button, Flex, FormControl, FormErrorMessage, Text, FormHelperText, FormLabel, Icon, Input, Spinner, Stack, Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import { MusicDocType } from "@/lib/firebase-docs-type";
import MusicListPreview from "./MusicListPreview";

import csv_parser  from "papaparse";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";

const UploadForm = ({
    onUpload
}: {
    onUpload: ()=> void
})=> {

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm();

    const inputRef = useRef<any>(null)

    const [loading, setLoading] = useState<boolean>(false);
    const [musics, setMusics] = useState<MusicDocType[]>([])
    const [logs, setLogs] = useState<string[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [isInvalidFile, setInvalidFile] = useState<boolean>(false)
    
    useEffect(()=> setInvalidFile(file == null), [file])

    const setLogMessage= (music: MusicDocType)=>{
        setLogs(l=> {
            l.push(`At Entry ${music.id} title: ${music.title}, artist: ${music.artist} an error occur can't upload it `)
            return l
        })
    }


    return <form style={{ display:'flex', flexDirection: 'column', gap: '1rem'}}
        onSubmit={(e)=> {
            e.preventDefault()

            if(loading) return;

            setLoading(true);
            handleSubmit((d)=> {
                if(file == null && musics.length <= 0) return;

                Promise.all(musics.map(music => {
                    let err = music.title.length <= 0 || music.artist.length <= 0
                    if(err){
                        setLogMessage(music)
                        return
                    }
                    
                    return uploadMusic(music.title, music.artist, d.title).catch(()=>{
                        setLogMessage(music)
                    })
                })).then(()=>{
                    setLoading(false)
                    reset()
                    setMusics([])
                    setFile(null)
                })
            }, (_)=> {
                setLoading(false);
            })();
        }}
    >
        <FormControl isInvalid={errors.title != undefined} >
            <FormLabel>Enter Bingo Title</FormLabel>
            <Input placeholder="bingo title"
                shadow={'dark-lg'}
                {...register("title", { 
                    required: {
                        value: true,
                        message: "title required"
                    },
                    minLength: {
                        value: 1,
                        message: "song name must be atleast 1 character long"
                    }
                })}
            />
            {errors.title && <FormErrorMessage color={'red.200'}>{errors.title?.message as string}</FormErrorMessage>}
        </FormControl>
        
        <FormControl isInvalid={isInvalidFile}>
            <FormLabel>Select CSV File</FormLabel>
            <Flex width='100%' bg={'white'} w={'100%'} rounded={'md'} 
                shadow={'dark-lg'} color={'blackAlpha.800'} 
                py={'3rem'} justifyContent={'center'}
                flexDir={'column'} alignItems={'center'}
                cursor={'pointer'} _hover={{
                    shadow: 'none'
                }} gap={'0.8rem'}
                onClick={()=>{
                    inputRef?.current?.click()
                }}
                border={ isInvalidFile ? '2px solid' : '0px solid'}
                borderColor={'red.400'}
            >
                <Image width="80" height="80" src="https://img.icons8.com/officel/80/export-csv.png" alt="export-csv"/>
                {musics.length > 0? <>
                    <Box color={'green.500'}>
                        <CheckIcon fontSize={'2xl'} className="inherit-parent-icon" /> 
                    </Box>
                </>
                : <>
                    Add CSV File
                </>}
                {loading && <Spinner colorScheme="blackAlpha" color="black"/>}
            </Flex>

            <Input
                type="file"
                accept=".csv"
                bg={'darkcyan'}
                style={{ display: "none" }}
                ref={inputRef}
                onChange={(e)=>{
                    let currFile = (e.target.files as FileList)[0]
                    if(!currFile) return;
                    setFile(currFile)

                    const reader = new FileReader();
                    setLoading(true)
                    reader.onload = (event) => {
                        if (event.target) {
                            const fileContent = event.target.result as string;
                            const { data } = csv_parser.parse(fileContent, {
                                header: true,
                                skipEmptyLines: true
                            })

                            data.forEach((d,i) => {
                                setMusics(m=>{
                                    m.push({
                                        title: Object.values(d as {})[0] as string,
                                        artist: Object.values(d as {})[1] as string,
                                        id: i+''
                                    })
                                    return m
                                })
                            });
                        }
                        setLoading(false)
                    };
                    reader.readAsText(currFile);
                }}
            />

            <FormHelperText>
                <Stack gap={'0.4rem'} mt={'1rem'}>
                    <Text fontSize={'md'}>
                        Please upload a CSV file with the following format:<br />
                    </Text>
                    <Text>
                        <strong>musicTitle, artistName</strong><br />
                        <br/>
                        Example:<br />
                            My Song Title, John Doe
                    </Text>
                </Stack>
            </FormHelperText>
            <FormErrorMessage color={'red.200'}>{"Select CVS File"}</FormErrorMessage>
        </FormControl>

        {/* preview */}

        {/* <FormControl isInvalid={errors.artistName != undefined}>
            <FormLabel>Enter Artist Name</FormLabel>
            <Input placeholder="artist name" shadow={'dark-lg'}
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
        </FormControl>     */}

        <center>
            <Button colorScheme="yellow" color={'white'} type="submit" isLoading={loading}>
                Upload
            </Button>
            <Button colorScheme="red" ml={'0.5rem'} onClick={()=> onUpload()} isDisabled={loading}>
                Cancel
            </Button>
        </center>

        {musics.length > 0 && <MusicListPreview musics={musics}/>}
        {logs.length > 0 && <Flex flexDirection={'column'} width={'100%'} p={'0.5rem'} bg={'white'} gap={'0.3rem'} rounded={'md'}>
            <Text color={'red.500'} fontSize={'md'}>
                <WarningIcon className="inherit-parent-icon" mx={'0.2rem'} pb={'0.1rem'}/>
                Error Logs 
            </Text>
            {logs.map((l, i)=>{
                return <Text key={i} color={'red.500'} pl={'1rem'}>- {l}</Text>
            })}
        </Flex>}
    </form> 
};

export default UploadForm;
