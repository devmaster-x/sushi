import { useEffect, useState } from 'react';

const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<{ address: string; score: number }[]>([]);

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

  return leaderboard;
};

export default useLeaderboard;
