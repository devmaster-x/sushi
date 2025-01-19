import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { createAppKit, useAppKitAccount } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { useGameContext } from "src/context/gameContext";
import { User } from "src/types/type";

const GameBoard = () => {
  const {
    currentRound,
    bucket,
    additionalSlots,
    lives,
    score,
    cards,
    leaderBoard,
    slotAvailablity,
    cardBoardWidth,
    rollbackAvailable,
    rollbackPressed,
    handleCardClick,
    moveToAdditionalSlots,
    rollbackFromAdditionalSlots,
    restartGame,
    registerUser,
    startNextRound,
    handleAdditionalCardClick,
    setCardBoardWidth,
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { address, isConnected } = useAppKitAccount();
  const [currentUser, setCurrentUser] = useState("");
  const [_user, setUserName] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [activeID, setActiveID] = useState<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
        setCurrentUser(data.username);
        // registerUser(data.username);
      } else {
        const defaultUsername = `user-${address!.slice(2, 6)}${address!.slice(-4)}`;
        setUserName(defaultUsername);
        setCurrentUser(defaultUsername);
        // registerUser();
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleNextRound = () => {
    setShowCongrats(false);
    startNextRound();
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const changeUserName = async () => {
    if (!_user.trim()) return;
    setModalOpen(false);
    // registerUser(_user);
    setCurrentUser(_user);
  };

  const handlePlay = () => {
    setGameStarted(true);
    restartGame();
  }

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-white flex flex-col justify-center items-center px-6 py-8">
      {/* <div className="max-w-[1280px] mx-auto w-full flex justify-between px-4 lg:px-24">
        <p className="text-2xl lg:text-4xl">Sushi Cards</p>
        <div className="flex gap-4">
          <p className="text-lg">UserName: {_user}</p>
          <button>edit</button>
        </div>
        <input type="text" className="text-lg" value={_user} onChange={changeUserName}/>
      </div> */}
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12">
        {/* Left Section: Game Info, Card Board */}
        <div className="flex flex-col items-center gap-6">
          {/* Card Board (Unchanged) */}
          <div
            className="relative mt-4 bg-gray-700 rounded-lg shadow-md overflow-hidden"
            style={{
              width: cardBoardWidth,
              height: cardBoardWidth,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className={`absolute bg-cover rounded-md ${
                  card.state === "available" ? "bg-[#8fde8b]" : "bg-gray-600"
                }`}
                style={{
                  backgroundImage: `url(assets/sushi/${card.type + 1}.png)`,
                  top: `${card.top}px`,
                  left: `${card.left}px`,
                  width: `40px`,
                  height: `40px`,
                  zIndex: card.zIndex,
                }}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Stash, Bucket, Leaderboard */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3 justify-around">
          {/* Buttons */}
          <div className="gap-4 flex lg:hidden">
            <button
              className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-3 py-1 rounded-md"
              onClick={moveToAdditionalSlots}
              disabled={!slotAvailablity || bucket.length === 0}
            >
              Move to Stash
            </button>
            <button
              className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-6 py-3 rounded-md"
              onClick={rollbackFromAdditionalSlots}
              disabled={!rollbackAvailable || rollbackPressed}
            >
              Rollback
            </button>
            <button
              className={`px-6 py-3 rounded-md ${
                gameStarted
                  ? "bg-[#4b2a2a] hover:bg-[#5b3a3a]"
                  : "bg-[#2a2b3c] hover:bg-[#3a3b4c]"
              } text-white`}
              onClick={restartGame}
            >
              {gameStarted ? "Restart" : "Play"}
            </button>
          </div>

          {/* Game Info */}
          <div className="w-full bg-[#704337] p-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold text-center text-gray-200">Game Info</h2>
            <div className="flex justify-between mt-4 text-gray-400">
              <p>Lives: {lives}</p>
              <p>Score: {score}</p>
              <p>Stage: {currentRound.roundNumber}</p>
            </div>
          </div>
          {/* Stash */}
          <div className="bg-[#704337] p-2 py-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold text-gray-200 text-center mb-2">Stash</h2>
            <div className="flex gap-2 justify-center">
              {additionalSlots.map((card) => (
                <div
                  key={card.id}
                  className="w-12 h-12 bg-[#ffe59e] rounded-md flex items-center justify-center bg-cover"
                  style={{ backgroundImage: `url(assets/sushi/${card.type + 1}.png)` }}
                  onClick={() => handleAdditionalCardClick(card)}
                />
              ))}
              {Array.from({ length: 3 - additionalSlots.length }).map((_, idx) => (
                <div key={`empty-slot-${idx}`} className="w-10 h-10 bg-gray-500 rounded-md" />
              ))}
            </div>
          </div>

          {/* Bucket */}
          <div className="bg-[#704337] p-2 py-4 rounded-md shadow-md">
            <h2 className="text-lg font-bold text-gray-200 text-center mb-2">Bucket</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {bucket.map((card) => (
                <div
                  key={card.id}
                  className="w-10 h-10 bg-[#8fde8b] rounded-md flex items-center justify-center bg-cover"
                  style={{ backgroundImage: `url(assets/sushi/${card.type + 1}.png)` }}
                />
              ))}
              {Array.from({ length: 7 - bucket.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="w-10 h-10 bg-gray-500 rounded-md" />
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-[#704337] p-6 rounded-md shadow-md">
            <h2 className="text-lg font-bold text-gray-200 text-center mb-4">Leaderboard</h2>
            {leaderBoard.length === 0 ? (
              <p className="text-gray-400 text-center">No leaderboard data available.</p>
            ) : (
              <ul className="space-y-2">
                {leaderBoard.map((user, index) => (
                  <li
                    key={index}
                    className={`flex justify-between p-2 rounded-md ${
                      user.email === ''
                        ? "bg-[#8fde8b] text-black"
                        : "text-gray-300"
                    }`}
                  >
                    <span>{index + 1}.</span>
                    <span>{user.username}</span>
                    <span>{user.score} pts</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Buttons */}
          <div className="gap-4 hidden lg:flex">
            <button
              className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200"
              onClick={moveToAdditionalSlots}
              disabled={!slotAvailablity || bucket.length === 0}
            >
              Move to Stash
            </button>
            <button
              className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200"
              onClick={rollbackFromAdditionalSlots}
              disabled={!rollbackAvailable || rollbackPressed}
            >
              Rollback
            </button>
            <button
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                !gameStarted
                  ? "bg-[#4b2a2a] hover:bg-[#5b3a3a]"
                  : "bg-[#2a2b3c] hover:bg-[#3a3b4c]"
              } text-white`}
              onClick={handlePlay}
            >
              {gameStarted ? "Restart" : "Play"}
            </button>
          </div>
        </div>

        {showCongrats && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#3faf1c] text-white text-center text-xl font-bold p-6 lg:p-10 rounded-md flex flex-col items-center">
              <p className="text-2xl mb-4">Congratulations!</p> 
              <p className="text-x1">You completed this round.</p>
              <button
                onClick={handleNextRound}
                className="mt-4 bg-transparent text-blue-600 py-2 px-4 rounded-lg hover:text-gray-600"
              >
                Start Next Round
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
