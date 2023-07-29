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

    switch (req.method) {
      case "GET":
        // Fetch bingo by ID
        const bingo = await collection.findOne({
          _id: new ObjectId(id as string),
        });

        if (!bingo) {
          return res.status(404).json({ error: "Bingo not found." });
        }

        res.status(200).json(bingo);
        break;

      case "PATCH":
        // Update bingo by ID
        const { title } = req.body;

        if (!title) {
          return res
            .status(400)
            .json({ error: "Title is required for update." });
        }

        const updatedBingo = await collection.findOneAndUpdate(
          { _id: new ObjectId(id as string) },
          { $set: { title } },
        );

        if (!updatedBingo.value) {
          return res.status(404).json({ error: "Bingo not found." });
        }

        res
          .status(200)
          .json({ acknowledged: updatedBingo.ok, res: updatedBingo.value });
        break;

      case "DELETE":
        const deletedBingo = await collection.findOneAndDelete({
          _id: new ObjectId(id as string),
        });

        if (!deletedBingo.value) {
          return res.status(404).json({ error: "Bingo not found." });
        }

        res.status(200).json({
          acknowledged: deletedBingo.ok,
          res: deletedBingo.value,
        });
        break;

      default:
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error", info: JSON.stringify(err) });
    console.error("Error\n", err);
  }
}
