import { useState, useEffect } from 'react';
import { createAppKit, useAppKitAccount } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { FaUserCircle } from "react-icons/fa";
import { useGameContext } from 'src/context/gameContext';
import { User } from "src/types/type"

const GameBoard = () => {
  const {
    currentUser,
    currentRound,
    bucket,
    additionalSlots,
    lives,
    score,
    cards,
    leaderBoard,
    slotAvailablity,
    isModalOpen,
    setIsModalOpen,
    setCurrentUser,
    handleCardClick,
    moveToAdditionalSlots,
    rollbackFromAdditionalSlots,
    restartGame,
    registerUser,
    startNextRound,
    setCards,
    setSlotAvailablity,
    handleAdditionalCardClick
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [_user, setUserName]  = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { address, isConnected } = useAppKitAccount()

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ''
    createAppKit({
      adapters: [new EthersAdapter()],
      networks: [mainnet, arbitrum],
      projectId,
      themeMode: 'dark'
    })
    if(!isConnected) return;
    else {
      checkUserName();
    }
    setGameStarted(true)
    restartGame();
  
  }, [isConnected, address]);

  useEffect(() => {
    if (cards.length == 0 && gameStarted) {
      checkRoundCompletion();
    }
  }, [cards]);
  
  const checkUserName = async () => {
    try {
      const response = await fetch(`/api/register?wallet=${address}`, { method: "GET" });
      console.log(" checking User Name : ", response);
      if (response.ok) {
        const data: User = await response.json();
        setUserName(data.username);
      } else {
        setUserName(`user-${address!.slice(0, 4)}...${address!.slice(-4)}`)
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("username changed : ", event.target.value);
    setUserName(event.target.value);
  };
  
  // Check if all cards have been removed or matched
  const checkRoundCompletion = () => {
    setShowCongrats(true);
  };

  const handleNextRound = () => {
    // Reset necessary states for the next round
    setShowCongrats(false);
    startNextRound(); // Proceed to the next round
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-8 items-center flex">
      <div className="max-w-[1280px] mx-auto flex gap-12 bg-gray-800 text-white p-6">
        <div className='flex flex-col'>
          <div className="relative w-[700px] h-[700px] bg-gray-700 rounded-lg shadow-md overflow-hidden">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`absolute bg-blue-500 text-white font-bold flex items-center justify-center rounded-lg cursor-pointer bg-cover ${
                  // card.state === 'available' ? 'opacity-100' : 'opacity-50'
                  card.state === 'available' ? 'bg-blue-500' : 'bg-gray-200 opacity-50'
                }`}
                style={{
                  backgroundImage: `url(assets/sushi/${card.type + 1}.png)`,
                  top: `${card.top}px`,
                  left: `${card.left}px`,
                  width: `${card.size.width}px`,
                  height: `${card.size.height}px`,
                  zIndex: card.zIndex,
                }}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
          <div className="w-full mx-auto justify-center mt-6 flex gap-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md"
              onClick={restartGame}
            >
              Restart Game
            </button>
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md"
              onClick={moveToAdditionalSlots}
              disabled={!slotAvailablity}
            >
              Move 3 Items to Stash
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md"
              onClick={rollbackFromAdditionalSlots}
            >
              Rollback from Stash
            </button>
          </div>
        </div>
        
        <div className="flex flex-col w-full h-full justify-between gap-12">
          <div className="flex justify-between items-center">
            <appkit-button />
            <button
              onClick={()=>setModalOpen(true)}
              className="flex items-center p-4"
            >
              <FaUserCircle size={28} className="text-gray-100 bg-gray-800 rounded-full" />
            </button>
          </div>
          <div>
            <h2 className=" text-center text-xl font-bold">Leaderboard</h2>
            <div className="bg-gray-700 rounded-lg p-4">
              {leaderBoard.length === 0 ? (
                <p>No leaderboard data yet.</p>
              ) : (
                <ul>
                  {leaderBoard.map((user, index) => (
                    <li key={user.wallet} className={`text-lg flex justify-between ${user.wallet === address ? 'text-green-600' : ''}`}>
                      <p>{index + 1}.</p>
                      <p>{user.username}</p> 
                      <p>{user.current_score} points</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl text-center font-bold">Bucket</h2>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-700 rounded-lg">
              {bucket.map((card) => (
                <div
                  key={card.id}
                  className="w-10 h-10 bg-green-500 text-center rounded-md flex items-center justify-center bg-cover"
                  style={{ backgroundImage: `url(assets/sushi/${card.type + 1}.png)` }}
                />
              ))}
              {Array.from({ length: 7 - bucket.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="w-10 h-10 bg-gray-500 rounded-md" />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl text-center font-bold">Stash</h2>
            <div className="flex gap-2 p-4 bg-gray-700 rounded-lg">
              {additionalSlots.map((card) => (
                <div
                  key={card.id}
                  className="w-10 h-10 bg-yellow-500 text-center rounded-md flex items-center justify-center bg-cover"
                  style={{ backgroundImage: `url(assets/sushi/${card.type + 1}.png)` }}
                  onClick={() => handleAdditionalCardClick(card)}
                />
              ))}
              {Array.from({ length: 3 - additionalSlots.length }).map((_, idx) => (
                <div key={`empty-slot-${idx}`} className="w-10 h-10 bg-gray-500 rounded-md" />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl text-center font-bold">Player Game Info</h2>
            <div className="flex justify-around gap-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-lg">Lives: {lives}</p>
              <p className="text-lg">Score: {score}</p>
              <p className="text-lg">Round: {currentRound.roundNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {showCongrats && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-500 text-white text-xl font-bold p-6 rounded-md flex flex-col items-center">
            <div>Congratulations! You completed this round.</div>
            <button
              onClick={handleNextRound}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Start Next Round
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Username</h2>
            <input
              type="text"
              value={_user}
              onChange={handleUsernameChange}
              className="border p-2 w-full mb-4 rounded text-black"
              placeholder="Enter new username"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={()=>{
                  setModalOpen(false);
                  setIsModalOpen(false);
                  setCurrentUser(_user);
                  registerUser(_user);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
