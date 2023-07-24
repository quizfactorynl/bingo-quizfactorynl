import Navbar from "./Navbar";
import { useDisclosure } from "@chakra-ui/react";
import UploadNEditModel from "./UploadNEditModel";
import MusicList from "./MusicList";

export default function Admin () {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return <>
        <Navbar onAddBtnClick={onOpen}/>
        <MusicList />
        {/* Upload Model */}
        <UploadNEditModel handler={{ isOpen, onOpen, onClose }}/>
    </>
}