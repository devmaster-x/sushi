import { useGameContext } from "src/context/gameContext";

const ButtonsWeb = () => {
  const {
    bucket,
    slotAvailablity,
    gameStarted,
    startNextRound,
    restartGame,
    handleHintSelected
  } = useGameContext();

  const handlePlay = () => {
    restartGame();
  }

  return (
    <div className="gap-4 hidden lg:flex justify-around">
      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={startNextRound}
      >
        Next
      </button> */}

      <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={handleHintSelected}
      >
        Hint
      </button>
      
      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={rollbackFromAdditionalSlots}
        disabled={!rollbackAvailable || rollbackPressed}
      >
        Rollback
      </button> */}
      <button
        className={`px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer ${
          !gameStarted
            ? "bg-green-600 hover:bg-green-400"
            : "bg-[#2a2b3c] hover:bg-[#3a3b4c]"
        } text-white`}
        onClick={handlePlay}
      >
        {gameStarted ? "Restart" : "Play"}
      </button>
    </div>
  )
}

export default ButtonsWeb;