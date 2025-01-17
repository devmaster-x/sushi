import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "src/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sushipop");
  const oneMinuteAgo = new Date(Date.now() - 10 * 1000);

  if (req.method === "GET") {
    try {
      // Fetch the top 3 users with the highest top_score
      const leaderboard = await db
        .collection("users")
        .find({ active: { $gte: oneMinuteAgo } })
        .sort({ current_score: -1 }) // Sort by top_score in descending order
        .toArray();

      res.status(200).json(leaderboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch leaderboard." });
    }
  } else if (req.method === "POST") {
    try {
      const { email, score } = req.body;

      if (!email || typeof score !== "number") {
        return res.status(400).json({ error: "email and score are required." });
      }

      const user = await db.collection("users").findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const updatedScore = Math.max(user.top_score || 0, score);
      await db.collection("users").updateOne(
        { email },
        { $set: { current_score: score, top_score: updatedScore } }
      );

      res.status(200).json({ message: "Score updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update score." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
