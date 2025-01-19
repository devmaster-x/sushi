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
    currentUser
  } = useGameContext();

  const handlePlay = () => {
    setGameStarted(true);
    restartGame();
  }

  return (
    <div className="gap-4 flex lg:hidden justify-between">
      <img
        src="assets/modal/buttons/Hint.png"
        alt="Hint"
        onClick={handleHintSelected}
        className="cursor-pointer hover:opacity-80 w-24"
      />

      <img
        src={gameStarted ? 'assets/modal/buttons/restart.png' : 'assets/modal/buttons/start.png' }
        alt="Restart"
        onClick={handlePlay}
        className="cursor-pointer hover:opacity-80 w-24"
      />
    </div>
  
  )
}

export default ButtonsMobile;