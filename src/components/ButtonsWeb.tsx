import { useGameContext } from "src/context/gameContext";
import SignInButton from './SignInButton'

const ButtonsWeb = () => {
  const {
    gameStarted,
    setGameStarted,
    restartGame,
    setShowConfirmModal,
    handleHintSelected,
    currentUser
  } = useGameContext();
  
  const handlePlay = () => {
    setGameStarted(true);
    restartGame();
  }

  if(!currentUser) return <div className="gap-4 hidden lg:flex justify-end">
    <SignInButton />
  </div>

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
        onClick={ ()=> gameStarted ? setShowConfirmModal(true) : handlePlay() }
      >
        {gameStarted ? "Restart" : "Play"}
      </button>

    {/* <button
          className="bg-[#FFD600] hover:opacity-80 text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
          onClick={handleHintSelected}
        >
          Hint
        </button>
        
        <button
          className={`px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer ${
            !gameStarted
              ? "bg-[#43A047]"
              : "bg-[#1E88E5]"
          } text-white hover:opacity-80`}
          onClick={ ()=> gameStarted ? setShowConfirmModal(true) : handlePlay() }
        >
          {gameStarted ? "Restart" : "Play"}
        </button> */}
    </div>
  )
}

export default ButtonsWeb;