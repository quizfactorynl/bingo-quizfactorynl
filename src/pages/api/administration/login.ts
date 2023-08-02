import type { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc } from "firebase/firestore";
import { adminsColRef } from "@/lib/firebase";
import { AdminDocType } from "@/lib/firebase-docs-type";

import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "POST") {
    res.status(404).send("Not Found");
    return;
  }

  try {
    const { uid, password } = req.body;
    const docRef = await getDoc(doc(adminsColRef, uid));

    if (!docRef.exists()) {
      res.status(404).send("No such document!");
      return;
    }

    if ((docRef.data() as AdminDocType).password != password) {
      res.status(404).send("Invalid password!");
      return;
    }

    // Create and send a JWT
    const token = jwt.sign(
      { uid, password },
      process.env.NEXT_PUBLIC_JWT_SECRET || "xyz",
      { expiresIn: "48h" },
    );

    // Set the JWT as an HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: true, // Set to true in production for HTTPS
        sameSite: "strict", // Set the SameSite attribute to 'strict' for added security
        maxAge: 3600 * 48, // 1 hour expiration (you can adjust this value according to your needs)
        path: "/", // Adjust the cookie path as needed based on your application's structure
      }),
    );

    // Send a success response
    res.status(200).json("Login successful");
  } catch (err) {
    res.status(500).send("An Unknown Error Occur");
    console.log("error\n", err);
  }
}
