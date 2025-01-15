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
    if(!validateCheck(username)) {
      setErrorMsg("Username contains alphabets and numbers only.");
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
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-black text-center">Change Username</h2>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex gap-2 items-center">
            <p className="text-black">User Name : </p>
            <input
              type="text"
              maxLength={16}
              value={username}
              onChange={handleUsernameChange}
              className="border p-2 w-3/5 rounded text-gray-600"
              placeholder="Enter new username"
            />
          </div>
          { invalid && <p className='text-red-500'>{errorMsg}</p> }
        </div>
        <div className="flex justify-between space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={ username === ''}
          >
            Cancel
          </button>

          <button
            onClick={_changeUserName}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={ username === ''}
          >
            {checkingName ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChangeName;