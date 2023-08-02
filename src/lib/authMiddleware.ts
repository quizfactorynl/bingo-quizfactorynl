import jwt from "jsonwebtoken";
import { parse } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "xyz"; // Replace with the same secret key used in login.js

// Middleware to verify JWT from HTTP-only cookie
export default function authMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => void,
) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = parse(req.headers.cookie || ""); // Parse the cookies from the request headers
    const token = cookies.token; // Extract the token from the 'token' cookie

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
      console.log(err);
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      // Set the authenticated user's data in the 'req.user' object
      //   req.user = user;
      return handler(req, res);
    });
  };
}
