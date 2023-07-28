import { Flex, useDisclosure } from "@chakra-ui/react"
import Navbar from "./Navbar"
import { useEffect, useState } from "react"
import { onSnapshot } from "firebase/firestore"
import { bingosColRef, refCodeColRef } from "@/lib/firebase"
import { BingoDocType, RefCodeDocType } from "@/lib/firebase-docs-type"
import CodeList from "./CodeList"
import RefCodeModal from "./models/RefCodeModal"

export default function RefCodes () {

    const [codes, setCodes] = useState<RefCodeDocType[]>([])
    const [bingos, setBingos] = useState<BingoDocType[]>([])

    const [changeFlag, setChangeFlag] = useState<boolean>(false)

    const modelHandler = useDisclosure()

    useEffect(()=> {
        const codeUnSub = onSnapshot(refCodeColRef, (snapShot)=> {
            setCodes(prev => snapShot.docs.map(doc=> {
                return {bingo_name: bingos.find(bingo=> bingo.id == (doc.data() as RefCodeDocType).bingo_id)?.title  
                        ,...doc.data()} as RefCodeDocType
            }))
            setChangeFlag(prev=> !prev)
         });
        
        const bingoUnSub = onSnapshot(bingosColRef, (snapShot)=> {
            setBingos(snapShot.docs.map(doc=> doc.data() as BingoDocType))
         });
        
        return ()=> {
            codeUnSub()
            bingoUnSub()
        }
    }, [])

    useEffect(()=> {
        setCodes(codes.map(code=> {
            code.bingo_name = bingos.find(bingo=> bingo.id == code.bingo_id)?.title 
            return code
        }))
    }, [bingos, changeFlag])
    
    return <Flex flexDirection={'column'} background={'var(--bg-gradient)'} minH={'100%'}>
        <Navbar onAddBtnClick={()=> modelHandler.onOpen()}/>
        <CodeList codes={codes}/>

        <RefCodeModal 
            handler={modelHandler}
            bingos={bingos}
            codes={codes}
        />
    </Flex>
}


