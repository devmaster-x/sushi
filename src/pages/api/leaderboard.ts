// pages/api/leaderboard.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface LeaderboardEntry {
  wallet: string;
  username: string;
  score: number;
}

const leaderboard: LeaderboardEntry[] = []; // Temporary in-memory leaderboard

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return the leaderboard
    return res.status(200).json(leaderboard);
  }

  if (req.method === 'POST') {
    const { wallet, username, score } = req.body;

    // Add or update user score in leaderboard
    const existingEntry = leaderboard.find(entry => entry.wallet === wallet);
    if (existingEntry) {
      existingEntry.score = Math.max(existingEntry.score, score); // Update score if higher
    } else {
      leaderboard.push({ wallet, username, score });
    }

    // Sort leaderboard by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);

    // Respond with the updated leaderboard
    return res.status(200).json(leaderboard);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
