import { API_ROUTES } from "@/lib/constant";
import { adminsColRef, firebase } from "@/lib/firebase";
import { Button, Center, Flex, Input, Link, Text } from "@chakra-ui/react";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from 'next/image';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";

const loginUser = async (
    uid: string, password: string
)=> {
    return axios.post(API_ROUTES.login, {
        uid, password
    })
}

export default function Login () {
    
    const [user, loading] = useAuthState(firebase.firebaseAuth)
    const [isValidUser, setIsValidUser] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [loginState, setLoginState] = useState({
        loading: false,
        message: ''
     })

    useEffect(()=> {
        if(user == null) return;

        const authenticateUser = async () => {
            const res = await getDoc(doc(adminsColRef, user.uid))
            setIsValidUser(res.exists());
         }

        authenticateUser()

    }, [user])

    const router = useRouter()

    return <Flex width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'}>
        <Flex  justifyContent={'center'} alignItems={'center'}
            flexDirection={'column'} gap={4}
        >
            <Link href="/">
                <Image src={'/Images/logo.png'} width={160} height={160} alt="logo-image" 
                    style={{ marginBottom: '0.8rem' }}
                />
            </Link>
            {user && <>
                <Input placeholder="Enter Email" minW={'250px'} disabled={true} value={user.email || ''}/>
            </>}

            {!user && <>
                <Button w={'full'} variant={'outline'} leftIcon={<FcGoogle />}
                    _hover={{
                        bg: 'whiteAlpha.400',
                    }}
                    onClick={()=>{
                        const provider = new GoogleAuthProvider()
                        signInWithPopup(firebase.firebaseAuth, provider)
                    }}
                >
                <Center>
                    <Text>Sign in with Google</Text>
                </Center>
                </Button>
            </>}
            <Input placeholder="Enter password" minW={'250px'}
                disabled={user == null} value={password}
                onChange={(e)=> setPassword(e.target.value)}
            />
            {isValidUser && <Link color={'blue.50'}>
                Forgot password?
            </Link>}
            {isValidUser && 
            <Button
                colorScheme="yellow" color={'white'}
                isLoading={loginState.loading} disabled={user == undefined}
                _disabled={{
                    opacity: 0.4,
                }}
                onClick={()=> {
                    if(!user) return;
                    setLoginState({...loginState, loading: true });

                    loginUser(user.uid as string, password).then(()=> {
                        router.push('/admin')
                        setLoginState({...loginState, loading: false });
                    }).catch(err=> {
                        setLoginState ({ loading: false, message: err.response.data })
                    })
                }}
            >
                Login
            </Button>}
            {(!isValidUser && user) && <Text color={'red.300'}>
                Gebruiker niet geauthenticeerd, gebruik een geldig e-mailadres    
            </Text>}
            {loginState.message.length > 0 && <Text color={'red.300'}>
                {loginState.message}
            </Text>}
        </Flex>
    </Flex>
}
