import { MusicDocType } from "@/lib/mongodb-schema";
import { UseStateProps } from "@/types/UseStateProps";
import { createContext } from "react";

interface MusicContextProps {
  id: string;
  state: UseStateProps<MusicDocType[]>;
}

const MusicContext = createContext<MusicContextProps>({} as MusicContextProps);
export default MusicContext;
