import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useGameContext } from 'src/context/gameContext';
import { User } from 'src/types/type';

const Settings = () => {
  const {
    currentUser,
    soundOff,
    musicOff,
    setMusicOff,
    setSoundOff,
    setShowSettingsModal,
    changeUserName
  } = useGameContext();
  const [username, setUsername] = useState(currentUser?.username!);
  const [checkingName, setCheckingName] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [invalid, setInvalid] = useState(false);

  const validateCheck = (username: string) : boolean => {
    const regex = /^[a-zA-Z0-9 ]+$/;
    return regex.test(username);
  }

  const isValidUserName = async (username : string) : Promise<boolean> => {
    setCheckingName(true);
    const response = await fetch(`/api/checkusername?username=${username}`, { method: "GET" });
    if(response.ok) { 
      setCheckingName(false);
      const data: User[] = await response.json();
      if(data.length == 1) {
        if(data[0].email == currentUser?.email) return true;
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

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="relative bg-contain bg-no-repeat rounded-lg shadow-lg overflow-hidden mx-auto w-[330px] h-[178px] flex items-end align-bottom p-8"
        style={{
          backgroundImage: `url(assets/modal/setting/setting.png)`,
        }}
      >
        <FaTimes 
          onClick={() => setShowSettingsModal(false)}
          className="absolute text-gray-500 hover:text-gray-800 cursor-pointer hover:opacity-80 top-4 right-4 w-4 h-4"
        />
        <img 
          src={`assets/modal/setting/${musicOff ? 'off.png' : 'on.png'}`}
          className='absolute cursor-pointer w-10 h-6'
          style={{
            top: '80px',
            left: '185px'
          }}
          onClick={()=>setMusicOff(!musicOff)}
        />

        <img 
          src={`assets/modal/setting/${soundOff ? 'off.png' : 'on.png'}`}
          className='absolute cursor-pointer w-10 h-6'
          style={{
            top: '113px',
            left: '185px'
          }}
          onClick={()=>setSoundOff(!soundOff)}
        />
      </div>
    </div>
  )
}

export default Settings;