import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "src/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("raulminibattle");
  
  if (req.method === "POST") {
    try {
      const { email } = req.body;

      if (!email) return res.status(400).json({ error: "email is required." });

      await db.collection("users").findOneAndUpdate(
        { email },
        {
          $set: {
            active: new Date()
          } 
        }
      );
      return res.status(201).json({ message: "User updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
