import { API_ROUTES } from "@/lib/constant";
import { adminsColRef, firebase, signOutUser } from "@/lib/firebase";
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
    
    // const [user, loading] = useAuthState(firebase.firebaseAuth)
    const [isValidUser, setIsValidUser] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [loginState, setLoginState] = useState({
        loading: false,
        message: ''
    })







    const [email, setEmail] = useState<string>("")








 useEffect(()=> setIsValidUser(email == (process.env.NEXT_PUBLIC_ADMIN_EMAIL as string)), [email])

















    


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
            <Input placeholder="Enter Email" minW={'250px'}  value={email}
                onChange={(e)=> setEmail(e.target.value)}
            />
            
            <Input placeholder="Enter password" minW={'250px'}
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                type="password"
            />
            {isValidUser && <Link color={'blue.50'}>
                Forgot password?
            </Link>}
            <Button
                colorScheme="yellow" color={'white'}
                isLoading={loginState.loading} 
                _disabled={{
                    opacity: 0.4,
                }}
                onClick={()=> {
                    if(email != (process.env.NEXT_PUBLIC_ADMIN_EMAIL as string)) return setIsValidUser(false);
                    setLoginState({...loginState, loading: true });

                    loginUser(email, password).then(()=> {
                         window.location.href = '/admin'
                        setLoginState({...loginState, loading: false });
                    }).catch(err=> {
                        setLoginState ({ loading: false, message: err.response.data })
                    })
                }}
            >
                Login
            </Button>
            
            {loginState.message.length > 0 && <Text color={'red.300'}>
                {loginState.message}
            </Text>}
            
        </Flex>
    </Flex>
}
