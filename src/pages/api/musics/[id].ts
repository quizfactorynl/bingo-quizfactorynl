// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise, { COLLECTIONS } from "@/lib/mongodb";
import { BingoDocType, MusicDocType } from "@/lib/mongodb-schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "GET") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if(req.method == "GET") {

    try {
      const { id } = req.query

      const client = await clientPromise
      const db = client.db("bingo-db")

      const musicCollection = db.collection<MusicDocType>(COLLECTIONS.MUSICS)

      const docs = await musicCollection.aggregate([
        { $match: { bingo_id: id} },
        { $sample: { size: 16 } }
       ]).toArray()
      
      res.status(200).json(docs);
    } catch(err) {
      res.status(500).json({ error: "Server Error", info: JSON.stringify(err) });
    }
  }
}



