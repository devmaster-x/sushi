import { useGameContext } from "src/context/gameContext"; // Importing the context

const GameInfo = () => {
  const { currentRound, score, lives } = useGameContext();

  return (
    <div className="fixed top-1/4 left-3 bg-slate-400 bg-opacity-30 w-fit p-6 rounded-md shadow-md">
      <h1 className="text-lg font-semibold my-2">Game Info</h1>
      <div className="text-center">
        <p>Round: {currentRound.roundNumber}</p>
        <p>Score: {score}</p>
        <p>Lives: {lives}</p>
      </div>
    </div>
  );
};

export default GameInfo;
