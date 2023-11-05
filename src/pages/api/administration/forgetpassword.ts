import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "xyz"; // Replace with your actual secret key
const TOKEN_EXPIRATION = "5m"; // Token expiration time: 5 minutes

// Configure your email transport (SMTP settings)
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // Set to true if using SSL/TLS
  auth: {
    user: "",
    pass: "",
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method === "POST") {
    try {
      const { email } = req.body;

      // Check if the email is valid (you may add more validation logic)
      //   if (email != process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      //     res.status(400).json({ error: 'Invalid email' });
      //     return;
      //   }

      // Generate the JWT token with the email and expiration time
      const token = jwt.sign({ email }, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION,
      });

      // Now you can send the token to the user's email using your preferred method (e.g., nodemailer)
      // Replace the sendTokenByEmail function with your email sending logic
      await sendTokenByEmail(email, token);

      res.status(200).json({ message: "Token sent to email" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
      console.log("error\n", err);
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

function isValidEmail(email: string) {
  return email && typeof email === "string";
}

async function sendTokenByEmail(email: string, token: string): Promise<void> {
  // Email options
  const mailOptions = {
    from: "zain.personal47@gmail.com", // Sender address
    to: email, // List of recipients
    subject: "Your JWT Token", // Email subject
    text: `Your JWT token is: ${token}`, // Email body in plain text
    // You can also use HTML for the email body:
    // html: `<p>Your JWT token is: ${token}</p>`
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to send email");
  }
}
