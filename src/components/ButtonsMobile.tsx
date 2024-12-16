import { useGameContext } from "src/context/gameContext";

const ButtonsMobile = () => {
  const {
    bucket,
    slotAvailablity,
    rollbackAvailable,
    rollbackPressed,
    gameStarted,
    setGameStarted,
    restartGame,
    moveToAdditionalSlots,
    rollbackFromAdditionalSlots,
  } = useGameContext();

  const handlePlay = () => {
    setGameStarted(true);
    restartGame();
  }

  return (
    <div className="gap-4 flex lg:hidden justify-center">
      <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-3 py-1 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={() => {}}
        disabled={!slotAvailablity || bucket.length === 0}
      >
        Shop
      </button>
      <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-3 py-1 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={() => {}}
        disabled={!slotAvailablity || bucket.length === 0}
      >
        Hint
      </button>
      <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-3 py-1 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={rollbackFromAdditionalSlots}
        disabled={!rollbackAvailable || rollbackPressed}
      >
        Rollback
      </button>
      <button
        className={`px-6 py-3 rounded-md transition-colors duration-200 cursor-pointer ${
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

export default ButtonsMobile;