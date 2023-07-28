import { Flex, Grid, GridItem, Heading, useMediaQuery, Text, Button, Spinner } from "@chakra-ui/react"
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { MusicDocType } from "@/lib/mongodb-schema";
import { RefCodeDocType } from "@/lib/firebase-docs-type";
import axios from "axios";
import { API_ROUTES } from "@/lib/constant";
import { getDoc } from "firebase/firestore";
import { bingosColRef } from "@/lib/firebase";
import { WarningIcon } from "@chakra-ui/icons";
import { UseStateProps } from "@/types/UseStateProps";

export default function MusicList ({ refCode } : {
  refCode: RefCodeDocType
}) {
    const [isUnder600] = useMediaQuery("(max-width: 600px)");

    const [musics, setMusics] = useState<MusicDocType[]>([])
    const [loader, setLoader] = useState({
      loading:false,
      error: false
    })

    const [greenCards, setGreenCards] = useState<string[]>([])

    useEffect(()=> {
      setLoader({loading: true, error: false})
      axios.get(API_ROUTES.RANDOMS_MUSIC + '/' + refCode.bingo_id)
      .then((res)=> {
        setLoader({loading: false, error: false})
        setMusics(res.data)
      }).catch((err)=> {
        setLoader({loading: false, error: true})
      })
    }, [])

    if(loader.loading) {
      return <Flex width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}
        flexDir={'column'} gap={4}
      >
        <Spinner size="xl" />
        <Text>Loading...</Text>
      </Flex>
    }

    if(loader.error) {
      return <Flex width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}
        flexDir={'column'} gap={4}
      >
        <Text color={'red.400'} fontSize={'2xl'}>
          <WarningIcon mx={2} className="inherit-parent-icon"/>
          Some thing Went Wrong
        </Text>
        <Button size={'sm'} colorScheme="yellow" color={'white'}
          onClick={()=> {
            window.location.href = '/'
          }}
        >
          Go Home
        </Button>
      </Flex> 
    }

    
    return <Flex 
        justifyContent={'center'} alignItems={'center'} flexDirection={'column'}
        width={'100%'} height={'100%'}
    >
        {/* header */}
        <Heading fontWeight={700} fontSize={isUnder600 ? '2.5rem' :'4.5rem'} 
            textAlign={'center'} mt={'1rem'} textShadow={'dark-lg'}
        >
            FOUTE BINGO
        </Heading>

        {/* cards */}

        <Flex flex={1} bg={'white'} w={'100%'} justifyContent={'center'} alignItems={'center'}
        >
            <Cards cards={musics} greenCardsState={[greenCards, setGreenCards]}/>
        </Flex>
    
        {/* footer */}
        <Footer marginBottom={'1rem'} padding={'1rem'}/>
    </Flex>
}

const Cards = (
  { cards, greenCardsState }: { cards: MusicDocType[], greenCardsState: UseStateProps<string[]> }
) => {
    const [isUnder600] = useMediaQuery("(max-width: 650px)");
    const [isUnder800] = useMediaQuery("(max-width: 800px)")
    const [isUnder500] = useMediaQuery("(max-width: 500px)")

    return (
      <Flex maxW={'1400px'}>
      <Grid templateColumns="repeat(4, 1fr)" gap={4} width={'100%'} height={'100%'} p = {isUnder800 ? '1rem' : '2rem'} py={'5rem'}>
        {cards.map((card, index) => (
          <GridItem key={index} colSpan={1}>
            <Flex
              bg={ greenCardsState [0].includes(card._id as string) ?  "green.300": "white"}
              p={isUnder800 ? isUnder500 ? 1 : 2 : 4}
              boxShadow="dark-lg"
              borderRadius="md"
              onClick={()=>{
                if(greenCardsState[0].includes(card._id as string)) {
                  greenCardsState[1](greenCardsState[0].filter((greenCardId)=> greenCardId !== card._id))
                } else {
                  greenCardsState[1]([...greenCardsState[0], card._id as string])
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
                cursor: "pointer"
              }}
              justifyItems={'center'}
              alignContent={'center'}
              maxH={isUnder600 ? '150px' : 'initial'}
              justifySelf={'center'}
            >
                {isUnder500 ? <>
                    <Text fontSize={'xx-small'} color={'blackAlpha.900'} textAlign={'center'} fontWeight={'bold'}>{card.title}</Text>
                </>: <Heading as="h5" size={ isUnder600 ?  "sm" :"md" }  textAlign="center" color={'blackAlpha.900'}>
                {card.title}
              </Heading>}
            </Flex>
          </GridItem>
        ))}
      </Grid>
      </Flex>
    );
};
