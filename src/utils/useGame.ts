// useGame.ts (Frontend - React)

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:9000'); // Connect to Socket Server

// Fetch the leaderboard from backend API
const fetchLeaderboard = async () => {
  const response = await fetch('http://localhost:5000/leaderboard');
  const leaderboard = await response.json();
  return leaderboard;
};

// Register a new user with their wallet address and VIP status
const registerUser = async (address: string, isVIP: boolean) => {
  const payload = {
    address,
    vip: isVIP,
    score: 0,
  };

  await fetch('http://localhost:5000/new-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};

// Handle sending a score update to backend
const sendScore = (address: string, score: number) => {
  socket.emit('score-update', { address, score });
};

// Custom hook for handling game logic and socket integration
export const useGame = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [address, setAddress] = useState<string>('');
  const [isVIP, setIsVIP] = useState<boolean>(false);

  // Fetch leaderboard when the component mounts
  useEffect(() => {
    const initLeaderboard = async () => {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    };

    initLeaderboard();
    
    // Listen for real-time leaderboard updates via socket
    socket.on('leaderboard-update', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off('leaderboard-update');
    };
  }, []);

  // Handle wallet connection and registration
  const connectWallet = (walletAddress: string, vipStatus: boolean) => {
    setAddress(walletAddress);
    setIsVIP(vipStatus);
    registerUser(walletAddress, vipStatus); // Register user in the backend
  };

  // Handle sending the score after a game round
  const updateScore = (score: number) => {
    sendScore(address, score);
  };

  return {
    leaderboard,
    address,
    isVIP,
    connectWallet,
    updateScore,
  };
};
