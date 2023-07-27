// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise, { COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "bson";
import { BingoDocType } from "@/lib/mongodb-schema";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const { id } = req.query;

    const client = await clientPromise;
    const db = client.db("bingo-db");
    const collection = db.collection<BingoDocType>(COLLECTIONS.BINGOS);

    if (req.method === "GET") {
      // Fetch bingo by ID
      
      const bingo = await collection.findOne({
        _id: id as string
      }, {});
        
      if (!bingo) {
        return res.status(404).json({ error: "Bingo not found." });
      }

      res.status(200).json(bingo);
    } else if (req.method === "DELETE") {
      const deletedBingo = await collection.findOneAndDelete({ _id: id as string});

      if (!deletedBingo.value) {
        return res.status(404).json({ error: "Bingo not found." });
      }

      res.status(200).json(deletedBingo.value);
    } else {
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error", info: JSON.stringify(err)  });
    console.error("Error\n", err);
  }
}

