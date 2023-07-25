import { Flex, Grid, GridItem, Heading, useMediaQuery, Text } from "@chakra-ui/react"
import Footer from "./Footer";

const cardsData = [
    {
      title: "Baby, It's Cold Outside (feat. Darren Criss) foo",
    },
    {
      title: "Another Song 2",
    },
    {
      title: "Awesome Music 3",
    },
    {
      title: "Hit Song 4",
    },
    {
      title: "Top Track 5",
    },
    {
      title: "Favorite Melody 6",
    },
    {
      title: "Jazzy Tune 7",
    },
    {
      title: "Chill Beats 8",
    },
    {
      title: "Funky Rhythm 9",
    },
    {
      title: "Rock Anthem 10",
    },
    {
      title: "Bluesy Vibes 11",
    },
    {
      title: "Soulful Melodies 12",
    },
    {
      title: "EDM Banger 13",
    },
    {
      title: "Acoustic Serenade 14",
    },
    {
      title: "Rap Freestyle 15",
    },
    {
      title: "Piano Sonata 16",
    },
];


export default function MusicList () {
    const [isUnder600] = useMediaQuery("(max-width: 600px)");

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

        <Flex flex={1} bg={'white'} w={'100%'} justifyContent={'center'} alignItems={'center'}>
            <Cards cards={cardsData}/>
        </Flex>
    
        {/* footer */}
        <Footer marginBottom={'1rem'} padding={'1rem'}/>
    </Flex>
}

const Cards = ({ cards }: { cards: {title: string}[] }) => {
    const [isUnder600] = useMediaQuery("(max-width: 650px)");
    const [isUnder800] = useMediaQuery("(max-width: 800px)")
    const [isUnder500] = useMediaQuery("(max-width: 500px)")

    return (
      <Grid templateColumns="repeat(4, 1fr)" gap={4} width={'100%'} height={'100%'} p = {isUnder800 ? '1rem' : '2rem'} py={'5rem'}>
        {cards.map((card, index) => (
          <GridItem key={index} colSpan={1}>
            <Flex
              bg="white"
              p={isUnder800 ? isUnder500 ? 1 : 2 : 4}
              boxShadow="dark-lg"
              borderRadius="md"
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
    );
};



