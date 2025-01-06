import { useState, useEffect, useRef } from "react";
import { useGameContext } from "src/context/gameContext";
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
    restartGame,
    startNextRound,
    setCardBoardWidth,
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);

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
