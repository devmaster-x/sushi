import { useGameContext } from "src/context/gameContext";

const GameInfo = () => {
  const {
    currentRound,
    lives,
    score,
  } = useGameContext();

  return (
    <div className="w-full bg-[#704337] px-4 py-2 rounded-xl shadow-xl">
    {/* <div className="w-full bg-transparent px-4 rounded-md shadow-md"> */}
      {/* <h2 className="text-lg font-bold text-center text-gray-200">Game Info</h2> */}
      <div className="flex justify-between lg:justify-around text-[37474F]">
        {/* <p>Lives: {lives}</p> */}
        <p>Score: <span className="pl-6">{score}</span></p>
        <p>Stage: {currentRound.roundNumber}</p>
      </div>
    </div>
  )
}

export default GameInfo;