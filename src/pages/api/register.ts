import { NextApiRequest, NextApiResponse } from 'next';

interface RegisterPayload {
  wallet: string;
  username: string;
  isVIP: boolean;
  top_score: number;
  current_score: number;
}

let leaderboard: any[] = []; // This will act as an in-memory leaderboard for the sake of simplicity

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { wallet, username, isVIP, top_score, current_score }: RegisterPayload = req.body;

    // Check if the user is already registered
    const existingUserIndex = leaderboard.findIndex(user => user.wallet === wallet);

    if (existingUserIndex > -1) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Register the new user
    leaderboard.push({ wallet, username, isVIP, top_score, current_score });

    return res.status(200).json({ message: 'User registered successfully' });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
