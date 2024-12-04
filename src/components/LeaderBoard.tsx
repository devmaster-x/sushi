import React from "react";
import { useGameContext } from "src/context/gameContext";

const LeaderBoard = () => {
  const { leaderBoard } = useGameContext();

  return (
    <div className="fixed top-1/4 right-3 bg-slate-400 bg-opacity-30 w-fit p-6 rounded-md shadow-md h-[300px] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
      <ul className="space-y-3">
        {leaderBoard.map((player) => (
          <li key={player.wallet} className="flex justify-between">
            <span className="text-sm">
              {player.wallet} {player.isVIP && "🌟"}
            </span>
            <span className="font-bold text-yellow-500">{player.score} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderBoard;
