// useSocket.ts (Socket Integration - Frontend)
import { useEffect } from 'react';
import io from 'socket.io-client';

const useSocket = (updateLeaderboard: (leaderboard: any[]) => void) => {
  useEffect(() => {
    const socket = io('http://localhost:9000'); // Connect to socket server

    // Listen for leaderboard updates
    socket.on('leaderboard-update', (updatedLeaderboard) => {
      updateLeaderboard(updatedLeaderboard); // Update leaderboard state in your app
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [updateLeaderboard]);

  return;
};

export default useSocket;
