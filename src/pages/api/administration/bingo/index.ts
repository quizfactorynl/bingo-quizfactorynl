// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import clientPromise, { COLLECTIONS } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try { 
    const client = await clientPromise
    const db = client.db("bingo-db")
    const collection = db.collection(COLLECTIONS.BINGOS)


    switch(req.method) {
        case "POST":
            // post single document with
            const { title } = req.body;

            // Insert the new document with the provided title as the _id
            const newDocument = { _id: title, title };
            const result = await collection.insertOne(newDocument);
            res.status(201).json(result);
        break; 
        case "GET":
            // Send all docs from collection
            const docs = await collection.find({}).toArray();
            res.status(200).json(docs);
        break;
        case "DELETE":
            const delRes = await collection.deleteOne()
        break;
        
        default:
            res.setHeader("Allow", ["POST", "GET"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    } catch(err) {
        res.status(500).json({ error: "Server Error", info: JSON.stringify(err) });
    }
}
