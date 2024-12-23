import { useGameContext } from "src/context/gameContext";

const ButtonsMobile = () => {
  const {
    gameStarted,
    setGameStarted,
    restartGame,
    startNextRound,
    setShowConfirmModal,
    handleHintSelected
  } = useGameContext();

  const handlePlay = () => {
    setGameStarted(true);
    restartGame();
  }

  return (
    <div className="gap-4 flex lg:hidden justify-center">
      <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={startNextRound}
      >
        Next
      </button>

      <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={handleHintSelected}
      >
        Hint
      </button>

      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-3 py-1 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={rollbackFromAdditionalSlots}
        disabled={!rollbackAvailable || rollbackPressed}
      >
        Rollback
      </button> */}
      <button
        className={`px-6 py-2 rounded-md transition-colors duration-200 cursor-pointer ${
          !gameStarted
            ? "bg-green-600 hover:bg-green-400"
            : "bg-[#2a2b3c] hover:bg-[#3a3b4c]"
        } text-white`}
        onClick={ ()=> gameStarted ? setShowConfirmModal(true) : handlePlay() }
      >
        {gameStarted ? "Restart" : "Play"}
      </button>
    </div>
  
  )
}

export default ButtonsMobile;