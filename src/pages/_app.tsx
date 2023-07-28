import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from 'nextjs-progressbar';

import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";

export default function App({ Component, pageProps }: AppProps) {
  return <ChakraProvider theme={theme}>
    <NextNProgress color="var(--yellow-color-400)" height={4}/>
    <Component {...pageProps} />
  </ChakraProvider>
}





