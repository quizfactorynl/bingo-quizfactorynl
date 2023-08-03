// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise, { COLLECTIONS } from "@/lib/mongodb";
import { BingoDocType, MusicDocType } from "@/lib/mongodb-schema";

import authMiddleware from "@/lib/authMiddleware";
import { deleteDoc, getDocs, query, where } from "firebase/firestore";
import { refCodeColRef } from "@/lib/firebase";

export default authMiddleware(handler);

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method != "DELETE") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { id } = req.query;

    const client = await clientPromise;
    const db = client.db("bingo-db");

    const musicCollection = db.collection<MusicDocType>(COLLECTIONS.MUSICS);
    const deleteResult = await musicCollection.deleteMany({ bingo_id: id });
    const deletedCount = deleteResult.deletedCount;

    getDocs(query(refCodeColRef, where("bingo_id", "==", id))).then(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      },
    );

    // Respond with a success message
    res
      .status(200)
      .json({ message: `Deleted ${deletedCount} music documents.` });
  } catch (err) {
    console.log(err);
    res.status(500).end(`Server Error 500`);
  }
}
