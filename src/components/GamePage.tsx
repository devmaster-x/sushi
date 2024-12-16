import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { createAppKit, useAppKitAccount } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { useGameContext } from "src/context/gameContext";
import { User } from "src/types/type";
import ButtonsMobile from "./ButtonsMobile";
import ButtonsWeb from "./ButtonsWeb";
import CardBoard from "./CardBoard";
import GameInfo from "./GameInfo";
import Bucket from "./Bucket";
import LeaderBoard from "./LeaderBoard";
import CongratesModal from "./CongratesModal";

const GameBoard = () => {
  const {
    bucket,
    gameStarted,
    additionalSlots,
    cards,
    registerUser,
    startNextRound,
    setCardBoardWidth,
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);
  const { address, isConnected } = useAppKitAccount();
  const [_user, setUserName] = useState("");
  const [activeID, setActiveID] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => {
      const minSize = Math.min(window.innerWidth, window.innerHeight);
      minSize <= 750
        ? setCardBoardWidth(minSize - 50)
        : setCardBoardWidth(700);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";
    createAppKit({
      adapters: [new EthersAdapter()],
      networks: [mainnet, arbitrum],
      projectId,
      themeMode: "dark",
    });

    if (!isConnected) return;

    const id = setInterval(() => sendUserActive(), 10000);
    setActiveID(id);
    checkUserName();

    return () => {
      if (activeID) clearInterval(activeID);
    };
  }, [isConnected, address]);

  useEffect(() => {
    if (cards.length === 0 && gameStarted && bucket.length === 0 && additionalSlots.length === 0) {
      setShowCongrats(true);
    }
  }, [cards, bucket, additionalSlots]);

  const sendUserActive = () => {
    axios.post("/api/useractive", { wallet: address });
  };

  const checkUserName = async () => {
    try {
      const response = await fetch(`/api/register?wallet=${address}`, { method: "GET" });
      if (response.ok) {
        const data: User = await response.json();
        setUserName(data.username);
        registerUser(data.username);
      } else {
        const defaultUsername = `user-${address!.slice(2, 6)}${address!.slice(-4)}`;
        setUserName(defaultUsername);
        registerUser();
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleNextRound = () => {
    setShowCongrats(false);
    startNextRound();
  };

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-white flex flex-col justify-center items-center px-6 py-8">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12">
        {/* Left Section: Game Info, Card Board */}
        <CardBoard />

        {/* Right Section: Stash, Bucket, Leaderboard */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3 justify-around">
          <ButtonsMobile />
          <GameInfo />
          <Bucket />
          <LeaderBoard />
          <ButtonsWeb />
        </div>

        {showCongrats && (
          <CongratesModal handleClick={handleNextRound}/>          
        )}
      </div>
    </div>
  );
};

export default GameBoard;
