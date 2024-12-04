import { useGameContext } from "src/context/gameContext";

const ControlButtons = () => {
  const { startNextRound, restartGame, loseLife } = useGameContext();

  return (
    <div className="w-4/5 mx-auto flex justify-center gap-6 mt-6">
      <button
        className="px-5 py-3 bg-slate-800 bg-opacity-50 rounded-lg text-white text-lg margin-5 hover:scale-110"
        onClick={startNextRound}
      >
        Start Next Round
      </button>
      <button
        className="px-5 py-3 bg-slate-800 bg-opacity-50 rounded-lg text-white text-lg margin-5 hover:scale-110"
        onClick={restartGame}
      >
        Restart Game
      </button>
      <button
        className="px-5 py-3 bg-slate-800 bg-opacity-50 rounded-lg text-white text-lg margin-5 hover:scale-110"
        onClick={loseLife}
      >
        Lose Life
      </button>
    </div>
  );
};

export default ControlButtons;
