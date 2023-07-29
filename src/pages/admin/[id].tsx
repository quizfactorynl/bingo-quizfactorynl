import MainLayout from "@/layouts/MainLayout";
import { montserratFont } from "@/theme/fonts";

import { GetServerSidePropsContext } from "next";
import { API_ROUTES, BASE_URL } from "@/lib/constant";

import axios from "axios";
import { MusicDocType } from "@/lib/mongodb-schema";
import Musics from "@/components/admin/Musics";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  const res = await fetch(BASE_URL + API_ROUTES.MUSICS + "/" + id);
  const musics = await res.json();

  return {
    props: {
      id,
      musics,
    },
  };
}

export default function index({
  id,
  musics,
}: {
  id: string;
  musics: MusicDocType[];
}) {
  return (
    <MainLayout
      pageTitle="Bingo - Admin"
      mainProps={{ className: `${montserratFont.className}` }}
    >
      <Musics musics={musics} id={id} />
    </MainLayout>
  );
}
