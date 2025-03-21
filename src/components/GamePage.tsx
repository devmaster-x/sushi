import { useState, useEffect, useRef } from "react";
import { useGameContext } from "src/context/gameContext";
import { useSession, signIn, signOut } from "next-auth/react"
import axios from "axios";
import { User } from "src/types/type";
import {
  ButtonsMobile,
  ButtonsWeb,
  CardBoard,
  GameInfo,
  Bucket,
  LeaderBoard,
  Header,
  CongratesModal,
  FailedModal,
  ConfirmModal,
  ChangeName,
  GuideModal,
  Settings,
  HowToPlay
} from './index'

const GameBoard = () => {
  const {
    bucket,
    gameStarted,
    additionalSlots,
    cards,
    gameOver,
    showConfirmModal,
    currentUser,
    showEditModal,
    soundOff,
    showSettingsModal,
    showGuide,
    loading,
    setCardSize,
    setShowGuide,
    setShowSettingsModal,
    registerUser,
    restartGame,
    startNextRound,
    setCardBoardWidth,
    fetchLeaderboard,
    cardBoardWidth
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeID, setActiveID] = useState<NodeJS.Timeout>();     //Interval ID
  const { data: session } = useSession()

  useEffect(() => {
    const handleResize = () => {
      const minSize = Math.min(window.innerWidth, window.innerHeight);
      if(minSize <= 750) {
        setCardBoardWidth(minSize - 50);
        setCardSize(Math.floor(minSize / 90) * 10);
      } else {
        setCardBoardWidth(700);
        setCardSize(Math.floor(700 / 90) * 10);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (cards.length === 0 && gameStarted && bucket.length === 0 && additionalSlots.length === 0) {
      const audio = new Audio('/assets/audio/win.wav'); // Path to your audio file
      !soundOff && audio.play();
      setShowCongrats(true);
    }
  }, [cards, bucket, additionalSlots]);

  useEffect(() => {
    if(session) checkUserRegistered();
    return () => {
      if(!activeID) clearInterval(activeID);
    }
  },[signIn, session])

  useEffect(() => {
    if(!activeID) clearInterval(activeID);
  },[signOut])

  // const sendUserActive = () => {
  //   axios.post("/api/useractive", { email: session?.user?.email });
  //   fetchLeaderboard();
  // };

  const checkUserRegistered = async () => {
    try {
      // const response = await axios.post("https://api.sushifarm.io/users/exist",{ mail : session?.user?.email})
      // if (response.status === 200 && response.data.data === true) {
        registerUser(session?.user?.email!, session?.user?.name!)
        if(activeID == undefined) {
          // const id = setInterval(() => sendUserActive(), 10000);
          const id = setInterval(() => fetchLeaderboard(), 10000);
          setActiveID(id);  
        }
      // } else {
      //   setShowGuideModal(true);
      // }
    } catch (error) {
      console.error("Error checking user registered :", error);
    }
  };

  const handleNextRound = () => {
    setShowCongrats(false);
    startNextRound();
  };

  return (
    <div 
      className="min-h-screen bg-cover text-white flex flex-col justify-center items-center px-6 py-8"
      style={{
        backgroundImage: `url(assets/sushi/background.jpg)`,
      }}
    >
      <div className="absolute inset-0 bg-yellow-200 opacity-20"></div> 
      {/* <audio controls loop autoPlay muted={musicOff} src="/assets/audio/BG5.wav" hidden/> */}
      <div className="relative z-10">
        <div 
          className={`sm:w-[${cardBoardWidth}px] w-full mx-auto flex flex-col lg:hidden gap-4 h-full`}
        >
          <Header />
          <CardBoard />
          <GameInfo />
          <Bucket />
          { currentUser && <ButtonsMobile /> }
          {/* <ButtonsMobile /> */}
          <LeaderBoard />
        </div>
        <div className="max-w-[1280px] mx-auto hidden lg:flex lg:flex-row gap-4 h-full">
          {/* Left Section: Game Info, Card Board */}
          <div className="relative">
            <CardBoard />
            <img 
              src="assets/modal/setting/settings_icon.png" 
              className="absolute bottom-2 -left-14 w-12 h-12 cursor-pointer"
              onClick={() => setShowSettingsModal(true)}
            />
          </div>


          {/* Right Section: Stash, Bucket, Leaderboard */}
          <div className="flex flex-col gap-2 lg:min-w-1/3 justify-between">
            <div className="flex flex-col gap-4 justify-start">
              <Header />
              <GameInfo />
              <Bucket />
              {/* <ButtonsWeb /> */}
            </div>
            <div>
              { currentUser && <ButtonsWeb /> }
              {/* <ButtonsWeb /> */}
              <LeaderBoard />
            </div>
          </div>
        </div>
        { showCongrats && (
          <CongratesModal handleClick={handleNextRound}/>          
        )}
      </div>
      { gameOver && <FailedModal handleClick={restartGame}/>}
      { showConfirmModal && gameStarted && <ConfirmModal /> }
      { showGuideModal && <GuideModal /> }
      { showEditModal && <ChangeName /> }
      { showSettingsModal && <Settings /> }
      { showGuide && <HowToPlay /> }
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 h-full">
          <div className="w-16 h-16 border-4 border-gray-500 border-dashed rounded-full animate-spin slow-spin"></div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
