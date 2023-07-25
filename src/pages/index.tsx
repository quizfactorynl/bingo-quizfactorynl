import Entry from "@/components/Entry";
import MusicList from "@/components/MusicList";
import MainLayout from "@/layouts/MainLayout";

import { montserratFont } from "@/theme/fonts";
import { useState } from "react";

export default function Page() {
  const [showList, setShowList] = useState<boolean>(false)

  return <MainLayout mainProps={{ className: `${montserratFont.className}`}}> 
    {showList ? <MusicList />: <Entry onValidate={()=> {
      setShowList(true)
    }}/>}
  </MainLayout>
}






