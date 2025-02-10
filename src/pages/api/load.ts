import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from 'src/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sushipop");

  if (req.method === "POST") {
    try {
      const { email } = req.body;
      const _users = await db.collection("users").findOne({ email });

      if (!_users) {
        return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json({ message: "User info successfully loaded.", data: _users});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to load saved data." });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
