// Game.tsx (Frontend - React)

import React, { useEffect, useState } from 'react';
import { useGame } from 'src/utils/useGame'; // Import the custom game hook

const Game = () => {
  const { leaderboard, address, isVIP, connectWallet, updateScore } = useGame();

  const [score, setScore] = useState(0);

  // Call when the user clicks the "connect wallet" button
  const handleConnectWallet = () => {
    const mockWalletAddress = '0x1234...abcd'; // Mock address
    const mockIsVIP = true; // Assume VIP status is true (for testing)
    connectWallet(mockWalletAddress, mockIsVIP);
  };

  // Call when the user sends a score (after game move)
  const handleSendScore = () => {
    updateScore(score);
    setScore(0); // Reset score after sending
  };

  return (
    <div className="game-container">
      <h1>Game</h1>
      
      <div>
        <button onClick={handleConnectWallet}>Connect Wallet</button>
        <p>Address: {address}</p>
        <p>{isVIP ? 'VIP User' : 'Normal User'}</p>
      </div>
      
      <div>
        <h2>Leaderboard</h2>
        <ul>
          {leaderboard.map((player, index) => (
            <li key={index}>
              {player.address} - {player.score} points
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Score: {score}</h3>
        <button onClick={handleSendScore}>Send Score</button>
      </div>
    </div>
  );
};

export default Game;
