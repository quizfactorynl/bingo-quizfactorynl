import { Flex, Heading, useMediaQuery } from "@chakra-ui/react"
import Footer from "./Footer";

export default function MusicList () {
    const [isUnder600] = useMediaQuery("(max-width: 600px)");

    return <Flex 
        justifyContent={'center'} alignItems={'center'} flexDirection={'column'}
        width={'100%'} height={'100%'}
    >
        {/* header */}
        <Heading fontWeight={700} fontSize={isUnder600 ? '3.5rem' :'4.5rem'} 
            textAlign={'center'} mt={'2rem'} textShadow={'dark-lg'}
        >
            FOUTE BINGO
        </Heading>

        {/* cards */}

        <CardsRenderer />
    
        {/* footer */}
        <Footer marginBottom={'2rem'} />
    </Flex>
}


const CardsRenderer = ()=> {
    return <Flex bg={'white'} flex={1} width={'100%'}>
        hello there
    </Flex> 
}
