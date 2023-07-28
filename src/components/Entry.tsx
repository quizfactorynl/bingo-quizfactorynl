import { Box, Button, Flex, Heading, BoxProps, Text, useMediaQuery } from "@chakra-ui/react"
import VerificationCodeInput from "./design/VerificationCodeInput"
import Footer from "./Footer";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { refCodeColRef } from "@/lib/firebase";

export default function Entry ({
    onValidate
}: {
    onValidate: ()=> void
}) {
    const [input, setInput] = useState<string>('')
    const [loading, setLoading] = useState({
        value: false,
        error: false
    });

    console.log(input)

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
                if(loading.value) return;
                if(input.length === 5) {
                    setLoading({value: true, error: false})
                    getDoc(doc(refCodeColRef, input)).then((doc)=> {
                        if(doc.exists()) {
                            setLoading({
                                value: false,
                                error: false
                            })
                            // onValidate()
                            return
                        }

                        setLoading({
                            value: false,
                            error: true
                        })
                    })
                }
            }} 
                style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexDirection:'column'}}
            >
                <VerificationCodeInput 
                    inputProps={{
                        value: input,
                        onChange: (e)=> {
                            setInput(e)
                        }
                    }}
                />
                {/* Invalid Code */}
                {loading.error && <Text color={'red.300'}>
                    Deze code bestaat niet
                </Text>}
                <Box>
                    <Button  size={'lg'} colorScheme="yellow" color={'white'} type="submit"
                        isLoading={loading.value}
                    >
                        Genereer mijn kaart
                    </Button>
                </Box>
            </form>

            {/* Footer */}
            <Footer position={'fixed'} marginBottom={'2rem'} bottom={0} />
        </Flex>
    </>
}




