import { MusicDocType } from "@/lib/mongodb-schema";
import {
  Flex,
  Center,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useMediaQuery,
} from "@chakra-ui/react";

export default function MusicListPreview({
  musics,
}: {
  musics: Array<MusicDocType>;
}) {
  const [isUnder600] = useMediaQuery("(max-width: 600px)");
  const [isUnder1000] = useMediaQuery("(max-width: 1000px)");

  return (
    <Flex w={"100%"} p={isUnder600 ? "0.5rem" : "1rem"}>
      <Flex margin={"0 auto"} maxW={"1400px"} w={"100%"} flexDir={"column"}>
        <Center>
          <Heading>CSV File View</Heading>
        </Center>

        <TableContainer
          my={"1rem"}
          rounded={"lg"}
          bg={"white"}
          shadow={"dark-lg"}
        >
          <Table
            variant="simple"
            style={{ tableLayout: isUnder1000 ? "initial" : "fixed" }}
            overflow={"visible"}
          >
            <Thead>
              <Tr>
                <Th>Music</Th>
                <Th>Artist</Th>
              </Tr>
            </Thead>
            <Tbody>
              {musics.map((music, i) => {
                return (
                  <Tr key={i}>
                    <Td>{music.title}</Td>
                    <Td>{music.artist}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  );
}
