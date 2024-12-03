// Leaderboard.tsx
import { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/leaderboard');
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="absolute top-5 right-5 p-4 bg-white shadow-lg rounded-md max-w-xs">
      <h2 className="text-xl text-center font-bold">Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {leaderboard.map((player, index) => (
            <li key={index} className="text-lg">
              {index + 1}. {player.address} - {player.score} points
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;