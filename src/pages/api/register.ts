import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "src/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("raulminibattle");
  
  if (req.method === "GET") {
    try {
      // Get the wallet address from query parameters (use req.query for GET requests)
      const { wallet } = req.query;
      
      // Check if wallet is provided
      if (!wallet || typeof wallet !== 'string') {
        return res.status(400).json({ error: "Wallet address is required." });
      }

      // Find the user based on the wallet address
      const existingUser = await db.collection("users").findOne({ wallet });

      if (existingUser) {
        // If the user exists, return the user data
        res.status(200).json(existingUser);
      } else {
        // If the user does not exist
        res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch user data." });
    }
  }
  else if (req.method === "POST") {
    try {
      const { wallet, username } = req.body;

      if (!wallet || !username) {
        return res.status(400).json({ error: "Wallet and username are required." });
      }

      const existingUser = await db.collection("users").findOne({ wallet });

      if (!existingUser) {
        const newUser = {
          wallet,
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
          { wallet },
          { $set: newUser }
        );
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
