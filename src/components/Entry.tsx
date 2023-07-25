import { Box, Button, Flex, Heading, BoxProps, useMediaQuery } from "@chakra-ui/react"
import VerificationCodeInput from "./design/VerificationCodeInput"
import Footer from "./Footer";

export default function Entry ({
    onValidate
}: {
    onValidate: ()=> void
}) {
    return <>
        <Flex flexDir={'column'} w={'100%'} 
            justifyContent={'center'} alignItems={'center'} 
            height={'100%'} gap={'1rem'} p={'1rem'}
        >
            <Heading textAlign={'center'}>
            Vul de toeganscode in
            </Heading>
            <form onSubmit={(e)=> {
                e.preventDefault()
                onValidate()
            }} 
                style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexDirection:'column'}}
            >
                <VerificationCodeInput />
                <Box>
                    <Button  size={'lg'} colorScheme="yellow" color={'white'} type="submit">
                        Genereer mijn kaart
                    </Button>
                </Box>
            </form>

            {/* Footer */}
            <Footer position={'fixed'} marginBottom={'2rem'} bottom={0} />
        </Flex>
    </>
}




