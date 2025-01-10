import { useState, useEffect } from 'react'
import { useGameContext } from 'src/context/gameContext';
import { User } from 'src/types/type';

const ChangeNameModal = () => {
  const {
    currentUser,
    setShowEditModal,
    changeUserName
  } = useGameContext();
  const [username, setUsername] = useState(currentUser?.username!);
  const [checkingName, setCheckingName] = useState(false);
  const [invalid, setInvalid] = useState(false);

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
    const isValidName = await isValidUserName(username);
    if(!isValidName) setInvalid(true);
    else {
      setInvalid(false);
      setShowEditModal(false);
      changeUserName(currentUser?.email!, username);
    }
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-black text-center">Edit Username</h2>
        <input
          type="text"
          maxLength={16}
          value={username}
          onChange={handleUsernameChange}
          className="border p-2 w-full mb-4 rounded text-gray-600"
          placeholder="Enter new username"
        />
        { invalid && <p className='text-red-500'>Username is invalid</p> }
        <div className="flex justify-end space-x-4">
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

export default ChangeNameModal;