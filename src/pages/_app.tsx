import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";
import { useJWTAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import Loader from "@/components/design/Loader";
import ErrorPanel from "@/components/design/ErrorPanel";


export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()
  const [isValid, loading] = useJWTAuth()
  
  
  return (
    <ChakraProvider theme={theme}>
      <NextNProgress color="var(--yellow-color-400)" height={4} />
      {(!router.pathname.startsWith("/admin") || isValid) && <Component {...pageProps} />}
      {router.pathname.startsWith("/admin") && <>
        {loading ? <Loader /> : !isValid && <ErrorPanel errorType="admin"/> }
      </>}
    </ChakraProvider>
  );
}




