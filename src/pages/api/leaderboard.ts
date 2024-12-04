import { NextApiRequest, NextApiResponse } from 'next';

let leaderboard: any[] = []; // This will act as an in-memory leaderboard for the sake of simplicity

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const leaderboard = [
    { username: 'Player 1', score: 150, wallet: '0x123' },
    { username: 'Player 2', score: 120, wallet: '0x456' },
    { username: 'Player 3', score: 100, wallet: '0x789' },
    { username: 'Player 4', score: 80, wallet: '0xabc' },
    { username: 'Player 5', score: 70, wallet: '0xdef' },
  ];

  if (req.method === 'GET') {
    return res.status(200).json(leaderboard);
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
