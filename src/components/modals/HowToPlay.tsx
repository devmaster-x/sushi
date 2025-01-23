import { useGameContext } from "src/context/gameContext";
import { FaTimes } from 'react-icons/fa'

const FailedModal = () => {
  const { setShowGuide } = useGameContext();

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
      <div className="relative w-1/3">
        <FaTimes 
          onClick={() => setShowGuide(false) }
          className="absolute text-gray-500 hover:text-gray-800 cursor-pointer hover:opacity-80 top-8 right-10 w-6 h-6"
        />
        <img
          src="assets/images/HowToPlay.png"
          alt="OK"
        />
      </div>
    </div>
  )
}

export default FailedModal;