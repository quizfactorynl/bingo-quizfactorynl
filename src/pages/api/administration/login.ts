// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try { 
    const client = await clientPromise
    const db = client.db("bingo-db")

    const { title } = req.body
    
    switch(req.method) {
        case "POST":
            // post single document with
        break; 
        case "GET":
            // send all docs from collection
        break;
    }

    res.send("good boi")
  } catch(err) {
    res.send("error")
    console.log("error\n", err)
  }
}
