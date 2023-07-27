// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise, { COLLECTIONS } from "@/lib/mongodb";
import { BingoDocType, MusicDocType } from "@/lib/mongodb-schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "POST" && req.method !== "GET") {
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
        { $sample: { size: 16 }}
      ]).toArray()
      
      res.status(200).json(docs);
    } catch(err) {
      res.status(500).json({ error: "Server Error", info: JSON.stringify(err) });
      console.error("Error\n", err);
    }

    return;
  }

  try {
    const { id } = req.query;

    const client = await clientPromise;
    const db = client.db("bingo-db");
    const bingoCollection = db.collection<BingoDocType>(COLLECTIONS.BINGOS);

    // Fetch the bingo by ID
    const bingo = await bingoCollection.findOne({ _id: id });

    if (!bingo) {
      return res.status(404).json({ error: "Bingo not found." });
    }

    const { title, artist, bingo_id } = req.body;
    const _id = `${title}-${artist}-${bingo_id}`;


    // Create the music document
    const musicData: MusicDocType = {
        _id,
        title,
        artist,
        bingo_id
    };
    
    const musicCollection = db.collection<MusicDocType>(COLLECTIONS.MUSICS);
    const result = await musicCollection.insertOne(musicData);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server Error", info: JSON.stringify(err) });
    console.error("Error\n", err);
  }
}

