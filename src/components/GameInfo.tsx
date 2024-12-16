import { useGameContext } from "src/context/gameContext";

const GameInfo = () => {
  const {
    currentRound,
    lives,
    score,
  } = useGameContext();

  return (
    <div className="w-full bg-[#252635] p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold text-center text-gray-200">Game Info</h2>
      <div className="flex justify-between mt-4 text-gray-400">
        <p>Lives: {lives}</p>
        <p>Score: {score}</p>
        <p>Round: {currentRound.roundNumber}</p>
      </div>
    </div>
  )
}

export default GameInfo;