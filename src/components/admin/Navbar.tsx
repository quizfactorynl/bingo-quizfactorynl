import { AddIcon } from "@chakra-ui/icons";
import { Flex, Heading, Button, Icon } from "@chakra-ui/react";

export default function Navbar ({
    onAddBtnClick
}: {
    onAddBtnClick?: ()=> void
}) {
    
    return <Flex w={'100%'} shadow={'dark-lg'} p = {'0.5rem'} borderBottom={'2px solid white'} boxShadow={'sm'} bg={'var(--light-blue)'}>
        <Flex maxW={'1400px'} w={'100%'} margin={'0 auto'} px={'0.5rem'}
            alignItems={'center'} 
        >
            <Heading textAlign={'center'} fontSize={'3xl'}>Admin</Heading>
            <Button ml={'auto'} color={'var(--light-blue)'} size={'md'} onClick={onAddBtnClick}
                shadow={'dark-lg'}
            >
                <Icon as={AddIcon} className="inherit-parent-icon" fontWeight={'extrabold'} fontSize={'xl'}/>
            </Button>
        </Flex>
    </Flex>
}


