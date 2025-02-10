import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "src/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sushipop");
  const currentDate = new Date();
  const currentWeekStart = new Date();
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
  
  if (req.method === "GET") {
    try {
      // Get the email address from query parameters (use req.query for GET requests)
      const { email } = req.query;
      
      // Check if email is provided
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "email address is required." });
      }

      // Find the user based on the email address
      const existingUser = await db.collection("users").findOne({ email });

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
      const { email, username, wallet } = req.body;

      if (!email || !username) {
        return res.status(400).json({ error: "email and username are required." });
      }

      const existingUser = await db.collection("users").findOne({ email });
      const oneMinuteAgo = new Date(Date.now() - 10 * 1000);

      if (!existingUser) {
        const newUser = {
          wallet,
          email,
          username,
          isVIP : false,
          top_score: 0,
          current_score: 0,
        };
        const leaderboardUser = {
          email,
          username,
          score: 0
        }
        const createdUser = await db.collection("users").insertOne(newUser);
        await db.collection("day").insertOne({ ...leaderboardUser, date: currentDate.toISOString().split('T')[0]});
        await db.collection("week").insertOne({
          ...leaderboardUser,
          startDate: currentWeekStart.toISOString().split('T')[0], // Start of the week
          endDate: new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // End of the week (Saturday)
        });
        await db.collection("entire").insertOne(leaderboardUser);
        return res.status(200).json({ message: "User registered successfully.", data: createdUser });
      } else {
        const newUser = {
          ...existingUser,
          current_score: existingUser.active > oneMinuteAgo ? existingUser.current_score : 0
        };
        await db.collection("users").updateOne(
          { email },
          { $set: newUser }
        );
        return res.status(200).json({ message: "User updated successfully.", data : newUser });
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
