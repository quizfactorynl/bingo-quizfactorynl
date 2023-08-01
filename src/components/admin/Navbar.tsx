import { ROUTES } from "@/lib/constant";
import { AddIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Flex,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebase, signOutUser } from "@/lib/firebase";
import { useEffect } from "react";

export default function Navbar({
  onAddBtnClick,
}: {
  onAddBtnClick?: () => void;
}) {
  const router = useRouter();
  const [user, loading]= useAuthState(firebase.firebaseAuth)

  useEffect(()=> {
    if(!user && !loading)
      router.push('/')
  }, [user])
  
  return (
    <Flex
      w={"100%"}
      shadow={"dark-lg"}
      p={"0.5rem"}
      borderBottom={"2px solid white"}
      boxShadow={"sm"}
      bg={"var(--light-blue)"}
    >
      <Flex
        maxW={"1400px"}
        w={"100%"}
        margin={"0 auto"}
        px={"0.5rem"}
        alignItems={"center"}
      >
        <Link href={ROUTES.MUSICS}>
          <Image src="/Images/Logo.png" alt="logo" width={70} height={70} />
        </Link>

        <Button
          ml={"auto"}
          color={"var(--light-blue)"}
          size={"md"}
          onClick={onAddBtnClick}
          shadow={"dark-lg"}
        >
          <Icon
            as={AddIcon}
            className="inherit-parent-icon"
            fontWeight={"extrabold"}
            fontSize={"xl"}
          />
        </Button>

        <Menu>
          <MenuButton
            as={Button}
            ml={2}
            color={"blackAlpha.900"}
            colorScheme="yellow"
          >
            <Icon
              as={LinkIcon}
              className="inherit-parent-icon"
              color={"blackAlpha.900"}
            />
          </MenuButton>
          <MenuList>
            <MenuItem color={"blackAlpha.900"} onClick={() => router.push("/")}>
              Home
            </MenuItem>
            <MenuItem
              color={"blackAlpha.900"}
              onClick={() => router.push(ROUTES.MUSICS)}
            >
              Admin
            </MenuItem>
            <MenuItem
              color={"blackAlpha.900"}
              onClick={() => router.push(ROUTES.REF_CODES)}
            >
              Reference Code
            </MenuItem>
          </MenuList>
        </Menu>

        {user && <Button ml={'0.5rem'} colorScheme="red" onClick={()=>{
          signOutUser().then(()=> window.location.reload())
        }}>
          Sign-out
        </Button>}
      </Flex>
    </Flex>
  );
}

