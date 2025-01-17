import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "src/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sushipop");
  
  if (req.method === "POST") {
    try {
      const { email, username, wallet } = req.body;

      if (!email || !username) {
        return res.status(400).json({ error: "email and username are required." });
      }

      const existingUser = await db.collection("users").findOne({ email });

      if (!existingUser) {
        const newUser = {
          wallet,
          email,
          username,
          isVIP : false,
          top_score: 0,
          current_score: 0,
        };
        await db.collection("users").insertOne(newUser);
        return res.status(201).json({ message: "User registered successfully." });
      } else {
        const newUser = {
          ...existingUser,
          username: username,
        };
        await db.collection("users").updateOne(
          { email },
          { $set: newUser }
        );
        return res.status(201).json({ message: "User updated successfully.", username: username });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
