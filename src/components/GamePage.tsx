import { useState, useEffect } from 'react';
import { createAppKit, useAppKitAccount } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { useGameContext } from 'src/context/gameContext';

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
    handleCardClick,
    moveToAdditionalSlots,
    rollbackFromAdditionalSlots,
    restartGame,
    startNextRound,
    setCards,
    setSlotAvailablity,
    handleAdditionalCardClick
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
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
    setGameStarted(true)
    restartGame();
  
  }, [isConnected, address]);

  useEffect(() => {
    console.log("current cards : ", cards);
    if (cards.length == 0 && gameStarted) {
      checkRoundCompletion();  // Check if the round is complete on each render
    }
  }, [cards]);

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
    <div className="min-h-screen bg-gray-800 text-white p-6">
      {!isConnected ? (
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-2xl font-semibold">Match Sushi Cards</h1>
          <appkit-button />
          <p>Please connect your wallet to continue.</p>
        </div>
      ) : (
        <div className="w-full mx-auto flex flex-col gap-8 bg-gray-800 text-white p-6">
          <div className="flex justify-around items-center mb-6">
            <h1 className="text-2xl font-bold">Card Matching Game</h1>
            <appkit-button />
          </div>

          <div className="flex w-full justify-center gap-12">
            <div className="mt-6">
              <h2 className="text-xl font-bold">Leaderboard</h2>
              <div className="bg-gray-700 rounded-lg p-4">
                {leaderBoard.length === 0 ? (
                  <p>No leaderboard data yet.</p>
                ) : (
                  <ul>
                    {leaderBoard.map((user) => (
                      <li key={user.wallet} className="text-lg">
                        {user.username}: {user.score} points
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="relative w-[600px] h-[600px] bg-gray-700 rounded-lg shadow-md overflow-hidden">
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

            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold">Bucket</h2>
                <div className="grid grid-cols-4 gap-2 p-4 bg-gray-700 rounded-lg">
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
                <h2 className="text-xl font-bold">Additional Slots</h2>
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
                <p className="text-lg">Lives: {lives}</p>
                <p className="text-lg">Score: {score}</p>
                <p className="text-lg">Round: {currentRound.roundNumber}</p>
              </div>
            </div>
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
      )}

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
    </div>
  );
};

export default GameBoard;
