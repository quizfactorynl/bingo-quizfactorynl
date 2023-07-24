import { Box, Heading, useMediaQuery, BoxProps } from "@chakra-ui/react"

export default function Footer (props: BoxProps) {
    const [isUnder600] = useMediaQuery("(max-width: 600px)")

    return <Box {...props}>
        <Heading fontWeight={700} fontSize={isUnder600 ? '3.5rem' :'4.5rem'} textAlign={'center'}>
            QUIZ
        </Heading>
        <Heading fontWeight={"normal"} fontSize={isUnder600 ? '2xl': '3xl'} textAlign={'center'} ml={'10px'}>
            FACTORY
        </Heading>
    </Box>
}