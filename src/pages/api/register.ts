// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface User {
  wallet: string;
  username: string;
  isVIP: boolean;
  top_score: number;
  current_score: number;
}

const users: User[] = []; // Temporary in-memory storage (replace with DB later)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { wallet, username, isVIP, top_score, current_score } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.wallet === wallet);
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Register the new user
    users.push({ wallet, username, isVIP, top_score, current_score });

    // Respond with success
    return res.status(200).json({ message: 'User registered successfully' });
  } else {
    // Handle any other HTTP methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
