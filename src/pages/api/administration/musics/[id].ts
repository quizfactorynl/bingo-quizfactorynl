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

    const { title, artist, bingo_id } = req.body;
    const musicCollection = db.collection<MusicDocType>(COLLECTIONS.MUSICS);
    
    // Check if music already exists
    const existingMusic = await musicCollection.findOne({
      title: title as string,
      artist: artist as string,
      bingo_id: id as string,
    });

    if (existingMusic) {
      return res.status(409).json({ error: "Music already exists in the database" });
    }
    
    const result = await musicCollection.insertOne ({
      artist: artist as string,
      title: title as string,
      bingo_id: bingo_id as string
    })
    
    res.status(200).json({
      acknowledged: result.acknowledged,
      res: result
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error", info: JSON.stringify(err) });
    console.error("Error\n", err);
  }
}

