// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import clientPromise from "@/lib/mongodb";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const client = await clientPromise;
    const db = client.db("bingo-db");

    res.send("good boi");
  } catch (err) {
    res.send("error");
    console.log("error\n", err);
  }
}
