import Navbar from "./Navbar";
import { Flex, useDisclosure } from "@chakra-ui/react";
// import UploadNEditModel from "./UploadNEditModel";
// import MusicList from "./MusicList";

import type { BingoDocType } from "@/lib/mongodb-schema";
import BingoList from "./BingoList";

import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { bingosColRef } from "@/lib/firebase";
import BingoModal from "./models/BingoModal";

export default function Bingos() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [bingoList, setBingoList] = useState<BingoDocType[]>(bingos);

  const [bingoList, setBingoList] = useState<BingoDocType[]>([]);

  useEffect(() => {
    const unSub = onSnapshot(bingosColRef, (snapShot) => {
      setBingoList(snapShot.docs.map((doc) => doc.data() as BingoDocType));
    });

    return () => {
      unSub();
    };
  }, []);

  return (
    <Flex
      flexDirection={"column"}
      background={"var(--bg-gradient)"}
      minH={"100%"}
    >
      <Navbar onAddBtnClick={onOpen} />
      <BingoList bingoState={[bingoList, setBingoList]} />
      <BingoModal handler={{ isOpen, onOpen, onClose }} bingos={bingoList} />
    </Flex>
  );
}
