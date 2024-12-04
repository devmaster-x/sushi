import { NextApiRequest, NextApiResponse } from 'next';

let leaderboard: any[] = []; // This will act as an in-memory leaderboard for the sake of simplicity

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { wallet, username, score } = req.body;

    // Find the user by wallet address
    const userIndex = leaderboard.findIndex(user => user.wallet === wallet);

    if (userIndex > -1) {
      // Update score if the user exists
      leaderboard[userIndex].current_score = score;
      return res.status(200).json({ message: 'Leaderboard updated' });
    }

    return res.status(404).json({ message: 'User not found' });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
