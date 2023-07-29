import { extendTheme } from "@chakra-ui/react";
import { montserratFont } from "./fonts";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "var(--bg-gradient)",
      },
    },
  },
  colors: {
    yellow: {
      400: "var(--yellow-color-400)",
    },
  },
  fonts: {
    body: montserratFont.style.fontFamily,
    heading: montserratFont.style.fontFamily,
  },
  components: {
    Input: {
      variants: {
        outline: {
          field: {
            bg: "white",
            color: "black",
            _placeholder: {
              color: "var(--input-placeholder-color)",
            },
            _focus: {
              borderColor: "white",
            },
            _invalid: {
              borderColor: "red.200",
            },
          },
        },
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            border: "none",
            borderColor: "blackAlpha.600",
            bg: "var(--light-blue)",
          },
          td: {
            padding: "0.3rem",
            color: "blackAlpha.800",
            borderColor: "blackAlpha.400",
            textAlign: "center",
          },
        },
      },
    },
  },
});

export default theme;
