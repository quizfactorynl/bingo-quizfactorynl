import { Box, Heading, useMediaQuery, BoxProps } from "@chakra-ui/react";

import Image from "next/image";

export default function Footer(props: BoxProps) {
  const [isUnder600] = useMediaQuery("(max-width: 600px)");
  
  return (
    <Box {...props}>
      <Image
        src="/Images/Logo.png"
        alt="foo"
        width={isUnder600 ? 100 : 200}
        height={isUnder600 ? 100 : 200}
      />
    </Box>
  );
}
