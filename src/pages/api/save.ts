import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from 'src/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sushipop");
  if(req.method === "GET") {
    const { email } = req.body;
    const [ _users ] = await Promise.all([
      db.collection("users").findOne({ email }),
    ]);
    if (!_users) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(_users)
  }

  else if (req.method === "POST") {
    try {
      const { email, lastRound } = req.body;
      const [ _users ] = await Promise.all([
        db.collection("users").findOne({ email }),
      ]);

      if (!_users) {
        return res.status(404).json({ error: "User not found." });
      }

      await db.collection("users").updateOne(
        { email },
        { $set: { 
          lastround: lastRound
        } }
      );
      res.status(200).json({ message: "Round Info saved successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save current round Info." });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
