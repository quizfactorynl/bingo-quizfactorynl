import {
  Flex,
  Grid,
  GridItem,
  Heading,
  useMediaQuery,
  Text,
  Button,
  Spinner,
  Center,
  Icon,
} from "@chakra-ui/react";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { MusicDocType } from "@/lib/mongodb-schema";
import { BingoDocType, RefCodeDocType } from "@/lib/firebase-docs-type";
import axios from "axios";
import { API_ROUTES } from "@/lib/constant";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import { UseStateProps } from "@/types/UseStateProps";
import { doc, getDoc } from "firebase/firestore";
import { bingosColRef } from "@/lib/firebase";
import Loader from "./design/Loader";
import ErrorPanel from "./design/ErrorPanel";

export default function MusicList({ refCode }: { refCode: RefCodeDocType }) {
  const [isUnder600] = useMediaQuery("(max-width: 600px)");

  const [musics, setMusics] = useState<MusicDocType[]>([]);
  const [loader, setLoader] = useState({
    loading: false,
    error: false,
  });

  const [greenCards, setGreenCards] = useState<string[]>([]);
  const [bingo, setBingo] = useState<BingoDocType | null>(null)

  useEffect(() => {
    setLoader({ loading: true, error: false });
    axios
      .get(API_ROUTES.RANDOMS_MUSIC + "/" + refCode.bingo_id)
      .then((res) => {
        setLoader({ loading: false, error: false });
        setMusics(res.data);

        getDoc(doc(bingosColRef, refCode.bingo_id)).then(d=>{
          setBingo(d.data() as BingoDocType)
        })
      })
      .catch((err) => {
        setLoader({ loading: false, error: true });
      });
  }, []);

  if (loader.loading) return <Loader />;
  
  if (loader.error) {
    return <ErrorPanel errorType="client" />
  }
  
  return ( <Flex
    width={'100%'} height={'100%'} 
  >
    
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      width={"100%"}
      height={"100%"}
      bg={'white'}
      py={'9rem'}
    >
     
      {/* header */}
      
      <Flex
        width={'100%'}
        position={'fixed'}
        top={0}
        left={0}
        right={0}
        height={'8rem'}
        justifyContent="center" // This centers the child elements horizontally
      >
        <img
          src="./Images/up.png"
          alt="up-wave"
          style={{
            width: '100%',
            zIndex: -1, // Make sure the image is below the text
            position: 'absolute', // Set the image position to absolute
            height: '8rem'
          }}
        />
        <Heading
          fontWeight={700}
          fontSize={isUnder600 ? "2.5rem" : "4.5rem"}
          textAlign={"center"}
          mt={"1rem"}
          textShadow={"dark-lg"}
          position="relative" // Set the text position to relative to make it sit above the image
          zIndex={1} // Set the text's z-index to be higher than the image's z-index
        >
          {bingo?.title} BINGO
        </Heading>
      </Flex>


      {/* cards */}
    
      <Flex
        flex={1}
        bg={"white"}
        w={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Cards cards={musics} greenCardsState={[greenCards, setGreenCards]} />
      </Flex>

      

      {/* footer */}
      
      <Flex
        width={'100%'}
        position={'fixed'}
        bottom={0}
        left={0}
        right={0}
        height={'8rem'}
        justifyContent="center" // This centers the child elements horizontally
        alignItems={'center'}
      >
        <img
          src="./Images/down.png"
          alt="up-wave"
          style={{
            width: '100%',
            zIndex: -1, // Make sure the image is below the text
            position: 'absolute', // Set the image position to absolute
            height: '8rem'
          }}
        />
        <Footer  
          zIndex={2} position={'relative'} p = {'0.5rem'}
        />
      </Flex>

    </Flex>
    </Flex>
  );
}

const Cards = ({
  cards,
  greenCardsState,

}: {
  cards: MusicDocType[];
  greenCardsState: UseStateProps<string[]>;
}) => {
  const [isUnder600] = useMediaQuery("(max-width: 650px)");
  const [isUnder800] = useMediaQuery("(max-width: 800px)");
  const [isUnder500] = useMediaQuery("(max-width: 500px)");

  const [showMessage, setShowMessage] = useState(false);

  useEffect(()=> {
    setShowMessage(greenCardsState[0].length === 5)
  }, [greenCardsState[0]])

  return (
    <Flex maxW={"1400px"} height={'100%'} overflow={'hidden'}
      flexDir={'column'} 
    >
      <Grid
        templateColumns="repeat(4, 1fr)"
        gap={4}
        width={"100%"}
        height={"100%"}
        p={isUnder800 ? "1rem" : "2rem"}
        pt={"5rem"}
        pb={showMessage ? "2rem" :"5rem"}
      >
        {cards.map((card, index) => (
          <GridItem key={index} colSpan={1}>
            <Flex
              bg={
                greenCardsState[0].includes(card._id as string)
                  ? "green.300"
                  : "white"
              }
              p={isUnder800 ? (isUnder500 ? 1 : 2) : 4}
              boxShadow="dark-lg"
              borderRadius="md"
              onClick={() => {
                if (greenCardsState[0].includes(card._id as string)) {
                  greenCardsState[1](
                    greenCardsState[0].filter(
                      (greenCardId) => greenCardId !== card._id,
                    ),
                  );
                } else {
                  greenCardsState[1]([
                    ...greenCardsState[0],
                    card._id as string,
                  ]);
                }
              }}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
              overflow="hidden" // Hide any overflowing content
              textOverflow="ellipsis" // Display an ellipsis (...) when text overflows
              _hover={{
                opacity: "60%",
                cursor: "pointer",
              }}
              justifyItems={"center"}
              alignContent={"center"}
              maxH={isUnder600 ? "150px" : "initial"}
              justifySelf={"center"}
            >
              {isUnder500 ? (
                <>
                  <Text
                    fontSize={"xx-small"}
                    color={"blackAlpha.900"}
                    textAlign={"center"}
                    fontWeight={"bold"}
                  >
                    {card.title}
                  </Text>
                </>
              ) : (
                <Heading
                  as="h5"
                  size={isUnder600 ? "sm" : "md"}
                  textAlign="center"
                  color={"blackAlpha.900"}
                >
                  {card.title}
                </Heading>
              )}
            </Flex>
          </GridItem>
        ))}
      </Grid>
      {showMessage && <Center py={'1rem'}>
        <Text color={'blackAlpha.900'} textAlign={'center'} fontSize={'xl'}>
          <Text color={'green.500'} display={'inline-block'} mx={1} fontSize={'xl'} textAlign={'center'}>
            <Icon as={CheckIcon} className="inherit-parent-icon" color={'green.600'}/>
          </Text>
          <CheckIcon />
          Bingo has been Generated
        </Text>
      </Center>}
    </Flex>
  );
};



