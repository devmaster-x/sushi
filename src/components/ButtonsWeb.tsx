import { useGameContext } from "src/context/gameContext";
import SignInButton from './SignInButton'

const ButtonsWeb = () => {
  const {
    gameStarted,
    setGameStarted,
    restartGame,
    setShowConfirmModal,
    handleHintSelected,
    handleSave,
    handleLoad,
    startNextRound,
    setBGMusicTime,
    currentUser
  } = useGameContext();
  
  const handlePlay = () => {
    setGameStarted(true);
    restartGame();
  }

  return (
    <div className="gap-4 hidden lg:grid grid-cols-2 justify-center">
      <img
        src="assets/modal/buttons/Hint.png"
        alt="Hint"
        onClick={()=> gameStarted && handleHintSelected()}
        className="cursor-pointer hover:opacity-80 w-24 mx-auto"
      />

      <img
        src={gameStarted ? 'assets/modal/buttons/playagain.png' : 'assets/modal/buttons/play.png' }
        alt="Restart"
        onClick={handlePlay}
        className="cursor-pointer hover:opacity-80 w-24 mx-auto"
      />

    {gameStarted &&
      <img
        src="assets/modal/buttons/save.png"
        alt="Save"
        onClick={handleSave}
        className="cursor-pointer hover:opacity-80 w-24 mx-auto"
      />
     }

      {/* <img
        src="assets/modal/buttons/load.png"
        alt="Load"
        onClick={handleLoad}
        className="cursor-pointer hover:opacity-80 w-24 mx-auto"
      />  */}
      <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={handleLoad}
      >
        Load
      </button>

      {/* <button
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={startNextRound}
      >
        Next
      </button> */}
      
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