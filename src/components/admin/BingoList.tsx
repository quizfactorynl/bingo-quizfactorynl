import { BingoDocType } from "@/lib/mongodb-schema";
import { Button, Flex, useMediaQuery, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, UseDisclosureProps, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React from "react";
import { UseStateProps } from "@/types/UseStateProps";
import ConfirmationModal from "../design/models/ConfirmationModal";

import Link from "next/link";
import { useRouter } from "next/router";
import BingoModal from "./models/BingoModal";
import { deleteBingo } from "@/lib/firebase";

export default function BingoList ({ bingoState } : { bingoState: UseStateProps<BingoDocType[]>  }) {
    
    const [isUnder500] = useMediaQuery("(max-width: 500px)")
    const [bingos, setBingos] = bingoState
    
    if(bingos.length == 0)
        return <Flex p = {isUnder500 ? 5 :10} width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'} >
            <Text fontSize={'lg'} >No Bingo Found</Text>
        </Flex>

    return <Flex p = {isUnder500 ? 5 :10} width={'100%'} height={'100%'}>
        <Flex flexDirection={'column'} width={'100%'} justifyContent={'center'} alignItems={'center'} 
            gap={isUnder500 ? 2:4} 
            maxW={'1400px'} margin={'0 auto'}
        >
            {bingos.map((val, idx)=>{
                return <BingoUploadModal 
                    key={idx}
                    curr={val}
                    bingoState={bingoState}
                />
            })}
        </Flex>
    </Flex>
}

export const BingoUploadModal = ({ curr, bingoState }: 
    { curr: BingoDocType, bingoState: UseStateProps<BingoDocType[]> }
)=> {

    const [loading, setLoading] = useState<boolean>(false);
    const deleteModelHandler = useDisclosure()
    const updateModelHandler = useDisclosure()
    
    const [bingos, setBingos] = bingoState
    const toast = useToast()
    const router = useRouter()


    return <Flex p={4} bg={'white'}  width={'100%'}
        rounded={'lg'} shadow={'dark-lg'} textOverflow={'ellipsis'}
        alignItems={'center'} onClick={(e)=> {
            e.stopPropagation()
            // router.push(`${ROUTES.MUSICS}/${curr._id}`)
        }}
        _hover={{
            cursor: 'pointer',
            shadow: 'md'
        }}
    >
        <BingoModal 
            bingos={bingos}
            bingo={curr}
            handler={updateModelHandler}
        />
        <ConfirmationModal 
            isOpen={deleteModelHandler.isOpen} 
            onClose={deleteModelHandler.onClose} 
            message={`Are you sure to delete '${curr.title}' bingo? \n All the music and reference codes will be deleted too!`} 
            onYes={()=>{
                deleteModelHandler.onClose()
                setLoading(true);
                deleteBingo((curr as any).id).then(res=>{
                    setLoading(false);
                }).catch(err=>{
                    toast({
                        title: 'An Error Occur',
                        status: 'error'
                    })
                    setLoading(false);
                })
            }}
            />
            <Text fontSize={'md'} color={'blackAlpha.900'} textAlign={'center'}>
                {curr.title}
            </Text>
            <Flex ml={'auto'} gap={2}>
            <Button size={'sm'} colorScheme="blue" isLoading={loading}
                onClick={()=> updateModelHandler.onOpen()}
            >
                <EditIcon />
            </Button>
            <Button size={'sm'} colorScheme="red" onClick={()=>{
                deleteModelHandler.onOpen()
            }} isLoading={loading}>
                <DeleteIcon />
            </Button>
        </Flex>
    </Flex>
}
