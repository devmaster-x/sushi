import { useGameContext } from "src/context/gameContext";
import SignInButton from './SignInButton'

const ButtonsWeb = () => {
  const {
    gameStarted,
    setGameStarted,
    restartGame,
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
    <div className="gap-4 hidden lg:flex justify-around">
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
      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={setBGMusicTime}
      >
        Set
      </button> */}
      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={handleHintSelected}
      >
        Hint
      </button> */}
      {/* <button
        className={`px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer ${
          !gameStarted
            ? "bg-green-600 hover:bg-green-400"
            : "bg-[#2a2b3c] hover:bg-[#3a3b4c]"
        } text-white`}
        onClick={ ()=> gameStarted ? setShowConfirmModal(true) : handlePlay() }
      >
        {gameStarted ? "Restart" : "Play"}
      </button> */}
    </div>
  )
}

export default ButtonsWeb;