import MainLayout from "@/layouts/MainLayout";
import Bingos from "@/components/admin/Bingos";
import { montserratFont } from "@/theme/fonts";

import { BingoDocType } from "@/lib/mongodb-schema";

export default function index() {
  return (
    <MainLayout
      pageTitle="Bingo - Admin"
      mainProps={{ className: `${montserratFont.className}` }}
    >
      <Bingos />
    </MainLayout>
  );
}
