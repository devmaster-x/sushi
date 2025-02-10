import { useState, useEffect, useRef } from 'react';
import { FaCaretDown } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react"
import { useGameContext } from "src/context/gameContext";
import { SingInButton } from '.';

const Header = () => {
  const {
    currentUser,
    gameStarted,
    setShowEditModal,
    setShowSettingsModal,
    handleSave,
    handleLoad
  } = useGameContext();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },[])

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setDropdownOpen(false);
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
    setDropdownOpen(false);
  }
  
  if(!currentUser) return (
    <div className="gap-4 flex justify-end">
      <SingInButton />
    </div>
  )
  else return (
    <div className="w-full bg-[#704337] px-4 py-2 rounded-xl shadow-md">
      <div className="flex justify-between text-[37474F]">
        <div className='flex items-center'>
          <div
            className="rounded-full bg-cover text-gray-100 mr-4"
            style={{ 
              backgroundImage: `url(assets/sushi/22.png)`,
              width: "24px",
              height: "24px"
            }}
          />
          <p>{currentUser.username}</p>
        </div>
          <div
            ref = { dropdownRef }
            className='relative'
          >
            <button
              onClick={toggleDropdown}
              className="flex items-center"
            >
              <FaCaretDown size={28} className=" rounded-full" />
            </button>
            {isDropdownOpen && (
              // <div className="absolute -right-2 mt-2 w-48 px-4 py-2 bg-gray-600 rounded-md shadow-lg z-10 flex flex-col gap-2">
              <div className="absolute -right-2 mt-2 w-40 bg-gray-600 rounded-md shadow-lg z-10 flex flex-col">
                <button
                  onClick={() => gameStarted && handleSave()}
                  className={`hover:bg-[#3a3b4c] rounded-md transition-colors duration-200 cursor-pointer px-4 py-2 ${gameStarted ? "text-white" : "text-gray-400"}`}
                >
                  Save
                </button>

                <button
                  onClick={() => currentUser.lastRound && handleLoad()}
                  className={`hover:bg-[#3a3b4c] rounded-md transition-colors duration-200 cursor-pointer px-4 py-2 ${currentUser.lastRound ? "text-white" : "text-gray-400"}`}
                >
                  Load
                </button>

                <button
                  onClick={handleEdit}
                  // className="text-left text-blue-500 hover:text-blue-100 p-2 rounded"
                  className="hover:bg-[#3a3b4c] text-white rounded-md transition-colors duration-200 cursor-pointer px-4 py-2"
                >
                  Change name
                </button>

                <button
                  onClick={handleSettings}
                  className="hover:bg-[#3a3b4c] text-white rounded-md transition-colors duration-200 cursor-pointer px-4 py-2 lg:hidden"
                >
                  Sound / Music
                </button>

                {/* </div> */}
                <button 
                  className="hover:bg-[#3a3b4c] text-white rounded-md transition-colors duration-200 cursor-pointer px-4 py-2"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  )
}

export default Header;