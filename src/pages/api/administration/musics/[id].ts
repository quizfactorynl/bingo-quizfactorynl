// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise, { COLLECTIONS } from "@/lib/mongodb";
import { BingoDocType, MusicDocType } from "@/lib/mongodb-schema";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (
    req.method !== "POST" &&
    req.method !== "GET" &&
    req.method !== "DELETE" &&
    req.method !== "PATCH"
  ) {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (req.method == "GET") {
    try {
      const { id } = req.query;

      const client = await clientPromise;
      const db = client.db("bingo-db");

      const musicCollection = db.collection<MusicDocType>(COLLECTIONS.MUSICS);

      const docs = await musicCollection
        .aggregate([{ $match: { bingo_id: id } }])
        .toArray();

      res.status(200).json(docs);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Server Error", info: JSON.stringify(err) });
    }

    return;
  }

  if (req.method == "DELETE") {
    try {
      const { id } = req.query;

      const client = await clientPromise;
      const db = client.db("bingo-db");

      const musicCollection = db.collection(COLLECTIONS.MUSICS);

      // delete doc
      const clientRes = await musicCollection.findOneAndDelete({
        _id: new ObjectId(id as string),
      });
      if (!clientRes.ok) {
        res.status(500).json({ error: "Music Not found" });
        return;
      }

      res.status(200).json({
        res: clientRes,
        acknowledged: clientRes.ok,
      });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Server Error", info: JSON.stringify(err) });
    }
    return;
  }

  // ... (existing code)

  if (req.method == "PATCH") {
    try {
      const { id } = req.query;

      const client = await clientPromise;
      const db = client.db("bingo-db");

      const { title, artist, bingo_id } = req.body;
      const musicCollection = db.collection(COLLECTIONS.MUSICS);

      // Check if music already exists with the given title, artist, and bingo_id
      // Check if music already exists
      const existingMusic = await musicCollection
        .aggregate([
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$title", title as string] },
                  { $eq: ["$artist", artist as string] },
                  { $eq: ["$bingo_id", id as string] },
                ],
              },
            },
          },
        ])
        .toArray();

      if (existingMusic.length > 0) {
        console.error("Music already exists in the database");
        return res
          .status(409)
          .json({ error: "Music already exists in the database" });
      }

      // Update the music document with the new data
      const result = await musicCollection.findOneAndUpdate(
        { _id: new ObjectId(id as string) },
        {
          $set: {
            title: title as string,
            artist: artist as string,
            bingo_id: bingo_id as string,
          },
        },
      );

      if (existingMusic.length > 0) {
        console.error("Music already exists in the database");
        return res
          .status(409)
          .json({ error: "Music already exists in the database" });
      }

      res.status(200).json({
        acknowledged: result.ok === 1,
        updatedMusic: result.value,
      });
    } catch (err) {
      console.error("Error\n", err);
      res
        .status(500)
        .json({ error: "Server Error", info: JSON.stringify(err) });
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
    const existingMusic = await musicCollection
      .aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$title", title as string] },
                { $eq: ["$artist", artist as string] },
                { $eq: ["$bingo_id", id as string] },
              ],
            },
          },
        },
      ])
      .toArray();

    if (existingMusic.length > 0) {
      console.error("Music already exists in the database");
      return res
        .status(409)
        .json({ error: "Music already exists in the database" });
    }

    const result = await musicCollection.insertOne({
      artist: artist as string,
      title: title as string,
      bingo_id: bingo_id as string,
    });

    res.status(200).json({
      acknowledged: result.acknowledged,
      res: result,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error", info: JSON.stringify(err) });
  }
}
