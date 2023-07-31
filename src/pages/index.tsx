import Entry from "@/components/Entry";
import MusicList from "@/components/MusicList";
import MainLayout from "@/layouts/MainLayout";
import { RefCodeDocType } from "@/lib/firebase-docs-type";

import { montserratFont } from "@/theme/fonts";
import { useState } from "react";

export default function Page() {
  const [showList, setShowList] = useState<boolean>(false);
  const [refCode, setRefCode] = useState<RefCodeDocType | null>(null);

  return (
    <MainLayout  mainProps={{
       className: `${montserratFont.className}`
    }}>
      {showList ? (
        <>{refCode && <MusicList refCode={refCode} />} </>
      ) : (
        <Entry
          onValidate={(id) => {
            setRefCode(id);
            setShowList(true);
          }}
        />
      )}
    </MainLayout>
  );
}
