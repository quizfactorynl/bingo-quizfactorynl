// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import clientPromise, { COLLECTIONS } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try { 

    const allowMethods = ["POST", "GET"]

    if(!allowMethods.includes(req.method as string)) {
        res.setHeader("Allow", allowMethods);
        res.status(405).end(`Method ${req.method} Not Allowed`);

        return;
    }
    
    const client = await clientPromise
    const db = client.db("bingo-db")

    const bingoCollection = db.collection(COLLECTIONS.BINGOS)
    const collection = db.collection(COLLECTIONS.REF_CODES)

    switch(req.method) {
        case "POST":
            // post single document with
            const { code, bingo_id } = req.body;

            // Fetch the bingo by ID
            const bingo = await bingoCollection.findOne({ _id: bingo_id });

            if (!bingo) {
                return res.status(404).json({ error: "Bingo not found." });
            }

            // Insert the new document with the provided title as the _id
            const newDocument = { _id: code, code, bingo_id };
            const result = await collection.insertOne(newDocument);

            if(!result.acknowledged) {
                res.status(409).json({ error: "Reference code already exists"})
            }

            res.status(201).json(result);
        break; 
        case "GET":
            // Send all docs from collection
            const docs = await collection.find({}).toArray();
            res.status(200).json(docs);
        break;

        default:
            res.setHeader("Allow", allowMethods);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    } catch(err) {
        res.status(500).json({ error: "Server Error", info: JSON.stringify(err) });
    }
}
