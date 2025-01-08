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
  CongratesModal,
  FailedModal,
  ConfirmModal
} from './index'

const GameBoard = () => {
  const {
    bucket,
    gameStarted,
    additionalSlots,
    cards,
    gameOver,
    showConfirmModal,
    registerUser,
    restartGame,
    startNextRound,
    setCardBoardWidth,
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);
  const [activeID, setActiveID] = useState<NodeJS.Timeout>();     //Interval ID
  const { data: session } = useSession()

  useEffect(() => {
    const handleResize = () => {
      const minSize = Math.min(window.innerWidth, window.innerHeight);
      console.log("handle Resize : ", window.innerWidth, window.innerHeight);
      minSize <= 750
        ? setCardBoardWidth(minSize - 50)
        : setCardBoardWidth(700);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (cards.length === 0 && gameStarted && bucket.length === 0 && additionalSlots.length === 0) {
      const audio = new Audio('/assets/audio/win.mp3'); // Path to your audio file
      audio.play();
      setShowCongrats(true);
    }
  }, [cards, bucket, additionalSlots]);

  useEffect(() => {
    if(session) {
      const id = setInterval(() => sendUserActive(), 10000);
      setActiveID(id);

      checkUserRegistered();
    }
  },[signIn, session])

  useEffect(() => {
    if(!activeID) clearInterval(activeID);
  },[signOut])

  const sendUserActive = () => {
    axios.post("/api/useractive", { email: session?.user?.email });
  };

  const checkUserRegistered = async () => {
    try {
      const response = await fetch(`/api/register?email=${session?.user?.email}`, { method: "GET" });
      console.log("register fetch response : ", response);
      console.log("current user : ", session?.user?.name);
      // if (response.ok) {
        registerUser(session?.user?.email!, session?.user?.name!)
      // } else {
      //   window.location.href = "https://www.sushifarm.io";
      // }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
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
      <div className="w-full mx-auto flex flex-col lg:hidden gap-4">
        <GameInfo />
        <CardBoard />
        <Bucket />
        <ButtonsMobile />
        <LeaderBoard />
      </div>
      <div className="max-w-[1280px] mx-auto hidden lg:flex lg:flex-row gap-12">
        {/* Left Section: Game Info, Card Board */}
        <CardBoard />

        {/* Right Section: Stash, Bucket, Leaderboard */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3 justify-around">
          <GameInfo />
          <Bucket />
          <LeaderBoard />
          <ButtonsWeb />
        </div>
      </div>
      {showCongrats && (
        <CongratesModal handleClick={handleNextRound}/>          
      )}
      {gameOver && <FailedModal handleClick={restartGame}/>}
      {showConfirmModal && gameStarted && <ConfirmModal /> }
    </div>
  );
};

export default GameBoard;
