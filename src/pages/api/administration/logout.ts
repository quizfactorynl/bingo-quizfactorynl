import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the token by setting an expired cookie
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      expires: new Date(0), // Set the cookie expiration to a past date to invalidate it
      secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
      sameSite: "strict", // Set the SameSite attribute to 'strict' for added security
      path: "/", // Adjust the cookie path as needed based on your application's structure
    }),
  );

  res.json({ message: "Logout successful" });
}
