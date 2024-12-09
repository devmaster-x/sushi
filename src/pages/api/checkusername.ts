import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "src/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("raulminibattle");

  if (req.method === "GET") {
    try {
      const { username } = req.query;

      // Check if username is provided and valid
      if (!username || Array.isArray(username) || typeof username !== 'string') {
        return res.status(400).json({ error: "User name is required and must be a string." });
      }

      // Find the user based on the username
      const existingUsers = await db.collection("users").find({ username }).toArray();

      if (existingUsers.length === 0) {
        return res.status(404).json([{}]); // Send a proper response
      }

      // Send the array of users as a response
      return res.status(200).json(existingUsers);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return res.status(500).json({ error: "Failed to fetch user data." });
    }
  } else {
    res.setHeader("Allow", ["GET"]); // Change allowed method to GET
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
