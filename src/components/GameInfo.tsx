import { useGameContext } from "src/context/gameContext";

const GameInfo = () => {
  const {
    currentRound,
    lives,
    score,
  } = useGameContext();

  return (
    <div className="w-full bg-[#704337] p-1 rounded-md clip-arrow">
      <div className="w-full p-0.5 bg-white rounded-md clip-arrow1">
        <div className="w-full bg-[#704337] pl-4 pr-8 py-2 shadow-xl text-white rounded-md text-md clip-arrow1">
          <div className="flex justify-between">
            <p>Score: <span className="pl-6">{score}</span></p>
            <p>Stage: {currentRound.roundNumber}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameInfo;