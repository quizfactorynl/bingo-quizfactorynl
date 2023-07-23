import { extendTheme } from "@chakra-ui/react";
import { ubuntuFont } from "./fonts";

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: 'var(--bg-gradient)'
            }
        },
    },
    colors: {
        yellow: {
            400: 'var(--yellow-color-400)'
        }
    },
    fonts: {
        body: ubuntuFont.style.fontFamily,
        heading: ubuntuFont.style.fontFamily
    }
})

export default theme;