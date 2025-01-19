import { useState, useEffect } from 'react'
import { useGameContext } from 'src/context/gameContext';
import { User } from 'src/types/type';

const ChangeName = () => {
  const {
    currentUser,
    soundOff,
    musicOff,
    setMusicOff,
    setSoundOff,
    setShowEditModal,
    changeUserName
  } = useGameContext();
  const [username, setUsername] = useState(currentUser?.username!);
  const [checkingName, setCheckingName] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [invalid, setInvalid] = useState(false);

  const validateCheck = (username: string) : boolean => {
    if(username=='') return true;
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

  const _changeUserName = async () => {
    if(username.length < 3 || username.length > 16) {
      setErrorMsg("Should be 3 to 16 characters.");
      setInvalid(true); 
    }

    else if(!validateCheck(username)) {
      setErrorMsg("Should be alphabets and numbers only.");
      setInvalid(true); 
    }
    else {  
      setErrorMsg("");
      const isValidName = await isValidUserName(username);
      if(!isValidName) {
        setErrorMsg("Same name is already exist.")
        setInvalid(true);
      }
      else {
        setInvalid(false);
        setShowEditModal(false);
        changeUserName(currentUser?.email!, username);
      }
    }
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(validateCheck(event.target.value)) setUsername(event.target.value);
  };

  const handleCancel = () => {
    setShowEditModal(false);
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="relative bg-contain bg-no-repeat rounded-lg shadow-lg overflow-hidden mx-auto w-[330px] h-[250px] flex items-end align-bottom p-8"
        style={{
          backgroundImage: `url(assets/modal/changename/confirmation_screen.png)`,
        }}
      >
        <div 
          className='absolute'
          style={{
            top: "85px",
            left: "60px"
          }}
        >
          <input
            type="text"
            maxLength={16}
            minLength={3}
            value={username}
            onChange={handleUsernameChange}
            className="p-2 w-full rounded text-gray-600 bg-transparent border-transparent outline-none"
            placeholder="Enter New Nickname"
          />
          { invalid && <p className='text-red-500 mt-6'>{errorMsg}</p> }
        </div>

        <div className="flex justify-around w-full">
          <img
            src="assets/modal/changename/cancel.png"
            alt="Cancel"
            onClick={handleCancel}
            className="cursor-pointer hover:opacity-80 w-24"
          />

          <img
            src="assets/modal/changename/save.png"
            alt="OK"
            onClick={_changeUserName}
            className="cursor-pointer hover:opacity-80 w-24"
            aria-disabled={ username === ''}
          />
        </div>
      </div>
    </div>

  )
}

export default ChangeName;