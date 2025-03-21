import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from 'src/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sushipop");

  const currentDate = new Date();
  const currentWeekStart = new Date();
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Start of the week (Sunday)

  if (req.method === "POST") {
    try {
      const { email, username, wallet } = req.body;

      if (!email || !username) {
        return res.status(400).json({ error: "Email and new username are required." });
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
        const leaderboardUser = {
          email,
          username,
          score: 0
        }
        await db.collection("users").insertOne(newUser);
        await db.collection("day").insertOne({ ...leaderboardUser, date: currentDate.toISOString().split('T')[0]});
        await db.collection("week").insertOne({
          ...leaderboardUser,
          startDate: currentWeekStart.toISOString().split('T')[0], // Start of the week
          endDate: new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // End of the week (Saturday)
        });
        await db.collection("entire").insertOne(leaderboardUser);
        return res.status(201).json({ message: "User registered successfully." });
      } else {
        // Update the 'users' collection first
        await db.collection("users").updateOne(
          { email },
          { $set: { username: username } }
        );
      }

      // Update the 'day' collection
      await db.collection("day").updateMany(
        { email },
        { $set: { username: username } }
      );

      // Update the 'week' collection
      await db.collection("week").updateMany(
        { email },
        { $set: { username: username } }
      );

      // Update the 'entire' collection
      await db.collection("entire").updateMany(
        { email },
        { $set: { username: username } }
      );

      res.status(200).json({ message: "Username updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update username." });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


// import type { NextApiRequest, NextApiResponse } from "next";
// import clientPromise from "src/lib/mongodb";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const client = await clientPromise;
//   const db = client.db("sushipop");
  
//   if (req.method === "POST") {
//     try {
//       const { email, username, wallet } = req.body;

//       if (!email || !username) {
//         return res.status(400).json({ error: "email and username are required." });
//       }

//       const existingUser = await db.collection("users").findOne({ email });

//       if (!existingUser) {
//         const newUser = {
//           wallet,
//           email,
//           username,
//           isVIP : false,
//           top_score: 0,
//           current_score: 0,
//         };
//         await db.collection("users").insertOne(newUser);
//         return res.status(201).json({ message: "User registered successfully." });
//       } else {
//         const newUser = {
//           ...existingUser,
//           username: username,
//         };
//         await db.collection("users").updateOne(
//           { email },
//           { $set: newUser }
//         );
//         return res.status(201).json({ message: "User updated successfully.", username: username });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal server error." });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
