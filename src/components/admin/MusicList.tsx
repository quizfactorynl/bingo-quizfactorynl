import { musicsColRef } from "@/lib/firebase";
import { MusicDocType } from "@/lib/firebase-docs-type";
import { EditIcon } from "@chakra-ui/icons";
import { Flex, Center, Heading, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Button, Icon, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import UploadNEditModel from "./UploadNEditModel";

export default function MusicList () {

    const [musics, setMusics] = useState<MusicDocType[]>([]);
    const [editItem, setEditItem] = useState<MusicDocType | null>(null);
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [isUnder600] = useMediaQuery("(max-width: 600px)");
    const [isUnder1000] = useMediaQuery("(max-width: 1000px)");
    
    useEffect(()=> {
        onSnapshot(musicsColRef, (snapShot)=> {
            setMusics(snapShot.docs.map((doc)=> doc.data() as MusicDocType))
        });
    }, [])
    
    return <Flex w={'100%'} p={isUnder600 ? '0.5rem' : '1rem'}>
        <Flex margin={'0 auto'} maxW={'1400px'} w={'100%'}
            flexDir={'column'}
        >

            <Center>
                <Heading>Music List</Heading>
            </Center>

            
            <TableContainer my={'1rem'} rounded={'lg'} bg={'white'} shadow={'dark-lg'} >
                <Table variant='simple' style={{ tableLayout: isUnder1000 ? 'initial' : 'fixed'}}  overflow={'visible'}>
                    <Thead>
                    <Tr>
                        <Th>Music</Th>
                        <Th>Artist</Th>
                        <Th>Edit</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {musics.map((music, i)=> {
                            return <Tr key = {i}>
                                <Td>{music.title}</Td>
                                <Td>{music.artist}</Td>
                                <Td>
                                    <Button color={'blackAlpha.800'} size={'sm'} 
                                        onClick={()=> {
                                            setEditItem(music)
                                            onOpen()
                                        }}
                                    >
                                        <Icon as={EditIcon} className="inherit-parent-icon" />
                                    </Button>
                                </Td>
                            </Tr>
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>

        <UploadNEditModel handler={{ isOpen, onClose, onOpen }} editItem={editItem as MusicDocType} />
    </Flex>
}