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
  ConfirmModal
} from './index'
import { ChangeName, GuideModal, Settings } from "./modals";

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
    setShowSettingsModal,
    registerUser,
    restartGame,
    startNextRound,
    setCardBoardWidth,
    fetchLeaderboard,
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeID, setActiveID] = useState<NodeJS.Timeout>();     //Interval ID
  const { data: session } = useSession()

  useEffect(() => {
    const handleResize = () => {
      const minSize = Math.min(window.innerWidth, window.innerHeight);
      minSize <= 750
        ? setCardBoardWidth(minSize - 50)
        : setCardBoardWidth(700);
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
      const response = await axios.post("https://devapi.sushifarm.io/users/exist",{ mail : session?.user?.email})
      if (response.status === 200 && response.data.data === true) {
        registerUser(session?.user?.email!, session?.user?.name!)
        if(activeID == undefined) {
          // const id = setInterval(() => sendUserActive(), 10000);
          const id = setInterval(() => fetchLeaderboard(), 10000);
          setActiveID(id);  
        }
      } else {
        setShowGuideModal(true);
      }
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
        backgroundImage: `url(assets/sushi/background.png)`,
      }}
    >
      {/* <audio controls loop autoPlay muted={musicOff} src="/assets/audio/BG5.wav" hidden/> */}
      <div className="w-full mx-auto flex flex-col lg:hidden gap-4 h-full">
        <Header />
        <CardBoard />
        <GameInfo />
        <Bucket />
        { currentUser && <ButtonsMobile /> }
        {/* <ButtonsMobile /> */}
        <LeaderBoard />
      </div>
      <div className="max-w-[1280px] mx-auto hidden lg:flex lg:flex-row gap-12 h-full">
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
        <div className="flex flex-col gap-2 w-full lg:w-1/3 justify-between">
          <div className="flex flex-col gap-4 justify-start">
            <Header />
            <GameInfo />
            <Bucket />
            {/* <ButtonsWeb /> */}
          </div>
          <div>
            { currentUser && <ButtonsWeb /> }
            <LeaderBoard />
          </div>
        </div>
      </div>
      { showCongrats && (
        <CongratesModal handleClick={handleNextRound}/>          
      )}
      { gameOver && <FailedModal handleClick={restartGame}/>}
      { showConfirmModal && gameStarted && <ConfirmModal /> }
      { showGuideModal && <GuideModal /> }
      { showEditModal && <ChangeName /> }
      { showSettingsModal && <Settings /> }
    </div>
  );
};

export default GameBoard;
