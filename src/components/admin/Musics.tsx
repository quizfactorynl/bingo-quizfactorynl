import Navbar from "./Navbar";
import { Flex, useDisclosure } from "@chakra-ui/react";
// import UploadNEditModel from "./UploadNEditModel";
// import MusicList from "./MusicList";

import type { MusicDocType } from "@/lib/mongodb-schema";
import { useState } from "react";
import UploadNEditModel from "./UploadNEditModel";
import MusicList from "./MusicList";

export default function Musics ({
    musics
}:{
    musics: MusicDocType[]
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ musicList, setMusicList] = useState<MusicDocType[]>(musics);

    return <Flex flexDirection={'column'} background={'var(--bg-gradient)'} minH={'100%'}>
        <Navbar onAddBtnClick={onOpen}/>
        <MusicList musicState={[musicList, setMusicList]} />
        <UploadNEditModel   handler={{ isOpen, onOpen, onClose }}/>
    </Flex>
}

