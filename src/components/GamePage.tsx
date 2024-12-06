import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createAppKit, useAppKitAccount } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { FaUserCircle } from "react-icons/fa";
import { useGameContext } from 'src/context/gameContext';
import { User } from "src/types/type"
import { useMediaQuery } from 'react-responsive';

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
    handleCardClick,
    moveToAdditionalSlots,
    rollbackFromAdditionalSlots,
    restartGame,
    registerUser,
    startNextRound,
    handleAdditionalCardClick,
    setCardBoardWidth
  } = useGameContext();

  const [showCongrats, setShowCongrats] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { address, isConnected } = useAppKitAccount();
  const [currentUser, setCurrentUser] = useState('');
  //username checking
  const [_user, setUserName]  = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [checkingName, setCheckingName] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [activeID, setActiveID] = useState<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      console.log("handle Resize : ", window.innerWidth, window.innerHeight);
      MIN(window.innerWidth, window.innerHeight) <=750 ? setCardBoardWidth(MIN(window.innerWidth, window.innerHeight) - 50) : setCardBoardWidth(700);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ''
    createAppKit({
      adapters: [new EthersAdapter()],
      networks: [mainnet, arbitrum],
      projectId,
      themeMode: 'dark'
    })

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    if(!isConnected) return;
    else 
    {
      const id = setInterval(() => sendUserActive(), 10000);
      setActiveID(id);
      checkUserName();  
    }

    return () => {
      if(activeID) clearInterval(activeID);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isConnected, address]);

  useEffect(() => {
    if (cards.length == 0 && gameStarted) {
      setShowCongrats(true);
    }
  }, [cards]);

  const MIN  = (a : number, b : number) : number => {
    return a < b ? a : b;
  }
  
  function sendUserActive() {
    axios.post('/api/useractive', { wallet : address });
  }
  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleEdit = () => {
    setModalOpen(true);
    setDropdownOpen(false);
  };


  const checkUserName = async () => {
    try {
      const response = await fetch(`/api/register?wallet=${address}`, { method: "GET" });
      if (response.ok) {
        const data: User = await response.json();
        setUserName(data.username);
        setCurrentUser(data.username);
        registerUser(data.username);
      } else {
        setUserName(`user-${address!.slice(2, 6)}${address!.slice(-4)}`)
        setCurrentUser(`user-${address!.slice(2, 6)}${address!.slice(-4)}`);
        registerUser();
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  }

  const isValidUserName = async (username : string) : Promise<boolean> => {
    setCheckingName(true);
    const response = await fetch(`/api/checkusername?username=${username}`, { method: "GET" });
    if(response.ok) { 
      setCheckingName(false);
      const data: User[] = await response.json();
      if(data.length == 1) {
        if(data[0].wallet == address) return true;
        else return false;
      }
      else return false;
    }
    else if(response.status == 404) {
      setCheckingName(false);
      return true;
    }
    else {
      setCheckingName(false);
      return false;
    }
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  
  const changeUserName = async () => {
    const isValidName = await isValidUserName(_user);
    if(!isValidName) setInvalid(true);
    else {
      setInvalid(false);
      setModalOpen(false);
      registerUser(_user);
      setCurrentUser(_user);
    }
  }
  const handleNextRound = () => {
    setShowCongrats(false);
    startNextRound();
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white items-center flex lg:p-8">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 bg-gray-800 text-white p-6">
        <div className='flex flex-col items-center'>

          {/* Header in Mobile */}
          <div className="justify-between items-center flex w-full lg:hidden">
            <appkit-button />
            <div
              ref = { dropdownRef }
              className='relative'
            >
              <button
                onClick={toggleDropdown}
                className="flex items-center p-4"
              >
                <FaUserCircle size={28} className="text-gray-100 bg-gray-600 rounded-full" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-0 w-48 px-4 bg-gray-600 rounded-md shadow-lg z-10">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-100 overflow-clip">{_user === '' ? "Loading..." : _user}</p>
                    <button
                      onClick={handleEdit}
                      className="text-left text-blue-500 hover:text-blue-100 p-2 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Current Game Info */}
          <div className="w-full bg-gray-700 rounded-lg p-2 lg:hidden">
            <h2 className="text-xl text-center font-bold p-2">Player Game Info</h2>
            <div className="flex justify-around gap-6">
              <p className="text-lg">Lives: {lives}</p>
              <p className="text-lg">Score: {score}</p>
              <p className="text-lg">Round: {currentRound.roundNumber}</p>
            </div>
          </div>

          {/* Card board */}
          <div 
            className={`relative mt-4 lg:mt-0 bg-gray-700 rounded-lg shadow-md overflow-hidden`}
            style={{
              width: cardBoardWidth,
              height: cardBoardWidth
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className={`absolute bg-blue-500 text-white font-bold flex items-center justify-center rounded-lg cursor-pointer bg-cover ${
                  // card.state === 'available' ? 'opacity-100' : 'opacity-50'
                  card.state === 'available' ? 'bg-blue-500' : 'bg-gray-600'
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

          {/* Mobile */}
          <div className="flex lg:hidden gap-4 w-full justify-between mt-4 lg:px-8">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg text-center font-bold">Bucket</h2>
                <div className="flex flex-wrap gap-1 p-2 bg-gray-700 rounded-lg">
                  {bucket.map((card) => (
                    <div
                      key={card.id}
                      className="w-8 h-8 bg-green-500 text-center rounded-md flex items-center justify-center bg-cover"
                      style={{ backgroundImage: `url(assets/sushi/${card.type + 1}.png)` }}
                    />
                  ))}
                  {Array.from({ length: 7 - bucket.length }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-8 h-8 bg-gray-500 rounded-md" />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg text-center font-bold">Stash</h2>
                <div className="flex gap-1 p-2 bg-gray-700 rounded-lg">
                  {additionalSlots.map((card) => (
                    <div
                      key={card.id}
                      className="w-8 h-8 bg-yellow-500 text-center rounded-md flex items-center justify-center bg-cover"
                      style={{ backgroundImage: `url(assets/sushi/${card.type + 1}.png)` }}
                      onClick={() => handleAdditionalCardClick(card)}
                    />
                  ))}
                  {Array.from({ length: 3 - additionalSlots.length }).map((_, idx) => (
                    <div key={`empty-slot-${idx}`} className="w-8 h-8 bg-gray-500 rounded-md" />
                  ))}
                </div>
              </div>
            </div>

            <div className="my-auto justify-center mt-6 flex flex-col gap-4 text-sm lg:text-base">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md shadow-md"
                onClick={moveToAdditionalSlots}
                disabled={!slotAvailablity}
              >
                Move 3 Items to Stash
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md shadow-md"
                onClick={rollbackFromAdditionalSlots}
              >
                Rollback from Stash
              </button>
              <button
                className={`${gameStarted ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white py-2 px-4 rounded-md shadow-md`}
                onClick={() => {
                  setGameStarted(true);
                  restartGame();
                }}
                // disabled={!isConnected}
              >
                {gameStarted ? 'Restart Game' : 'Play'}
              </button>
            </div>
          </div>

          {/* Button */}
          <div className="mx-auto justify-center mt-6 gap-4 text-sm lg:text-base hidden lg:flex">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md shadow-md"
              onClick={moveToAdditionalSlots}
              disabled={!slotAvailablity}
            >
              Move 3 Items to Stash
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-md shadow-md"
              onClick={rollbackFromAdditionalSlots}
            >
              Rollback from Stash
            </button>
            <button
              className={`${gameStarted ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white py-2 px-4 rounded-md shadow-md`}
              onClick={() => {
                setGameStarted(true);
                restartGame();
              }}
              // disabled={!isConnected}
            >
              {gameStarted ? 'Restart Game' : 'Play'}
            </button>
          </div>

          <div className='mt-4 w-full bg-gray-700 p-2 rounded-lg lg:hidden'>
            <h2 className=" text-center text-xl font-bold p-2">Leaderboard</h2>
            <div className="bg-gray-700 rounded-lg px-4">
              {leaderBoard.length === 0 ? (
                <p className='text-center'>No leaderboard data yet.</p>
              ) : (
                <ul>
                  {leaderBoard.map((user, index) => (
                    (index < 3 || user.wallet == address) && gameStarted && isConnected && <li key={user.wallet} className={`text-lg flex justify-between ${user.wallet === address ? 'text-green-600' : ''}`}>
                      <p>{index + 1}.</p>
                      <p>{user.username}</p> 
                      <p>{user.current_score} points</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-col w-full h-full justify-between gap-12 hidden lg:flex">
          <div className="flex justify-between items-center">
            <appkit-button />
            <div
              ref = { dropdownRef }
              className='relative'
            >
              <button
                onClick={toggleDropdown}
                className="flex items-center p-4"
              >
                <FaUserCircle size={28} className="text-gray-100 bg-gray-600 rounded-full" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-0 w-48 px-4 bg-gray-600 rounded-md shadow-lg z-10">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-100 overflow-clip">{_user === '' ? "Loading..." : _user}</p>
                    <button
                      onClick={handleEdit}
                      className="text-left text-blue-500 hover:text-blue-100 p-2 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className=" text-center text-xl font-bold">Leaderboard</h2>
            <div className="bg-gray-700 rounded-lg p-4">
              {leaderBoard.length === 0 ? (
                <p className='text-center'>No leaderboard data yet.</p>
              ) : (
                <ul>
                  {leaderBoard.map((user, index) => (
                    (index < 3 || user.wallet == address) && gameStarted && isConnected && <li key={user.wallet} className={`text-lg flex justify-between ${user.wallet === address ? 'text-green-600' : ''}`}>
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
            <h2 className="text-xl font-semibold mb-4 text-black text-center">Edit Username</h2>
            <input
              type="text"
              value={_user}
              onChange={handleUsernameChange}
              className="border p-2 w-full mb-4 rounded text-gray-600"
              placeholder="Enter new username"
            />
            { invalid && <p className='text-red-500'>Username is invalid</p> }
            <div className="flex justify-around space-x-4">
              <button
                onClick={()=> {
                  setModalOpen(false);
                  setUserName(currentUser);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-400 text-white rounded"
                disabled={ _user === ''}
              >
                Cancel
              </button>

              <button
                onClick={changeUserName}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-400 text-white rounded"
                disabled={ _user === ''}
              >
                {checkingName ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
