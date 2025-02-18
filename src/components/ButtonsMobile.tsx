import { useGameContext } from "src/context/gameContext";

const ButtonsMobile = () => {
  const {
    gameStarted,
    setGameStarted,
    restartGame,
    startNextRound,
    setShowConfirmModal,
    handleHintSelected,
    setBGMusicTime,
    handleSave,
    handleLoad,
    currentUser
  } = useGameContext();

  const handlePlay = () => {
    setGameStarted(true);
    restartGame();
  }

  return (
    <div className="gap-4 lg:hidden grid grid-cols-2 justify-between">
      <img
        src="assets/modal/buttons/Hint.png"
        alt="Hint"
        onClick={handleHintSelected}
        className="cursor-pointer hover:opacity-80 w-24 justify-self-center"
      />

      <img
        src={gameStarted ? 'assets/modal/buttons/playagain.png' : 'assets/modal/buttons/play.png' }
        alt="Restart"
        onClick={handlePlay}
        className="cursor-pointer hover:opacity-80 w-24 justify-self-center"
      />

      { currentUser!.lastRound && <img
        src="assets/images/load.png"
        alt="Load"
        onClick={() => currentUser!.lastRound && handleLoad()}
        className="cursor-pointer hover:opacity-80 w-24 justify-self-center"
      />
      }

      {gameStarted &&<img
        src="assets/images/save.png"
        alt="Save"
        onClick={() => gameStarted && handleSave()}
        className="cursor-pointer hover:opacity-80 w-24 justify-self-center"
      />}

      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={startNextRound}
      >
        Next
      </button> */}
    </div>
  
  )
}

export default ButtonsMobile;