import { useState, useEffect } from "react"; 
import { useGameContext } from "src/context/gameContext";
import { FaTimes } from 'react-icons/fa'

const FailedModal = () => {
  const [isMobile, setMobile] = useState(false);
  const { setShowGuide } = useGameContext();

  useEffect(()=>{
    setMobile(window.innerWidth < 768);
  },[])
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
      <div className={`relative m-auto ${isMobile ? "w-4/5" : "w-1/2"}`}>
        <FaTimes 
          onClick={() => setShowGuide(false) }
          className="absolute text-gray-500 hover:text-gray-800 cursor-pointer hover:opacity-80 top-5 right-6 md:top-6 md:right:8 xl:top-8 xl:right-10 w-6 h-6"
        />
        <img
          src={`${isMobile ? "assets/images/Howtoplay-tg.png" : "assets/images/HowToPlay-pc.png"}`}
          alt="OK"
          className=""
        />
      </div>
    </div>
  )
}

export default FailedModal;