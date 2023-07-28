import Navbar from "./Navbar";
import { Flex, useDisclosure } from "@chakra-ui/react";

import type { MusicDocType } from "@/lib/mongodb-schema";
import { useEffect, useState } from "react";
import UploadNEditModel from "./UploadNEditModel";
import MusicList from "./MusicList";
import MusicContext from "@/hooks/MusicContext";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { bingosColRef } from "@/lib/firebase";

export default function Musics ({
    musics, id
}:{
    musics: MusicDocType[]
    id: string
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ musicList, setMusicList] = useState<MusicDocType[]>(musics);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter()

    useEffect(()=> {
        const unSub = onSnapshot(doc(bingosColRef, id), (snapShot)=>{
            setLoading(false)
            if(!snapShot.exists()){
                router.push('/404')
            }
         });

        return ()=> unSub()
    }, [])
    
    return <MusicContext.Provider value={{ id, state: [musicList, setMusicList] }}>
            <Flex flexDirection={'column'} background={'var(--bg-gradient)'} minH={'100%'}>
                <Navbar onAddBtnClick={onOpen}/>
                <MusicList musicState={[musicList, setMusicList]} />
                {!loading && <UploadNEditModel   handler={{ isOpen, onOpen, onClose }} />}
            </Flex>
    </MusicContext.Provider> 
}
