import { useGameContext } from "src/context/gameContext";

const ConfirmModal = () => {
  const { restartGame, setGameStarted, setShowConfirmModal } = useGameContext();

  const handlePlay = () => {
    setShowConfirmModal(false);
    setGameStarted(true);
    restartGame();
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1e1e2f] text-white text-center text-xl font-bold p-6 lg:p-10 rounded-md flex flex-col items-center">
        <p className="text-2xl">Restart Game</p> 
        <p className="text-x1">Do you really want to restart game?</p>
        <div className="flex justify-around">
          <button
            onClick={ () => setShowConfirmModal(false) }
            className="bg-transparent text-gray-400 py-2 px-4 rounded-lg hover:text-gray-600"
          >
            No
          </button>

          <button
            onClick={handlePlay}
            className="bg-transparent text-[#098fdd] py-2 px-4 rounded-lg hover:text-gray-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal;