import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from 'src/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sushipop");

  if (req.method === "POST") {
    try {
      const { email, newScore, date, startDate, endDate } = req.body;
      const [_users, _day, _week, _entire] = await Promise.all([
        db.collection("users").findOne({ email }),
        db.collection("day").findOne({ email, date }),
        db.collection("week").findOne({ email, startDate, endDate }),
        db.collection("entire").findOne({ email })
      ]);

      if (!email || !newScore) {
        return res.status(400).json({ error: "Email and score are required." });
      }

      // Update the 'users' collection first
      if (!_users) {
        return res.status(404).json({ error: "User not found." });
      }

      await db.collection("users").updateOne(
        { email },
        { $set: { 
          current_score: _users.current_score + newScore,
          top_score: _users.top_score < _users.current_score + newScore ? _users.current_score + newScore : _users.top_score
        } }
      );

      // Update the 'day' collection
      if (!_day) {
        await db.collection("day").insertOne({
          email,
          username: _users.username,
          score: newScore,
          date,
        });  
      } else {
        await db.collection("day").updateOne(
          { email, date },
          { $set: { score: _day.score + newScore } },
        );
      }

      // Update the 'week' collection
      if (!_week) {
        await db.collection("week").insertOne({
          email,
          username: _users.username,
          score: newScore,
          startDate,
          endDate
        });  
      } else {
        await db.collection("week").updateOne(
          { email, startDate, endDate },
          { $set: { score: _week.score + newScore } },
        );
      }

      // Update the 'entire' collection
      if(!_entire) {
        await db.collection("entire").insertOne({
          email,
          username: _users.username,
          score: newScore
        })
      } else {        
        await db.collection("entire").updateOne(
          { email },
          { $set: { score: _entire.score + newScore } },
        );
      }

      res.status(200).json({ message: "Score updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update score." });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
