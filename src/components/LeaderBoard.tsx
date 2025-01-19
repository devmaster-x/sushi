import { useGameContext } from "src/context/gameContext";
// import { useAppKitAccount } from "@reown/appkit/react";

const LeaderBoard = () => {
  const { 
    leaderBoard,
    currentUser 
  } = useGameContext();
  // const { address } = useAppKitAccount();

  return (
    <div
      className="bg-contain bg-no-repeat rounded-lg px-6 py-2 shadow-lg w-full mx-auto relative h-[300px]"
      style={{
        backgroundImage: `url(assets/modal/leaderboard/All-Time-High.png)`,
      }}
    >
    {/* <div className="bg-transparent p-6 rounded-md shadow-md mx-auto"> */}
      <h2 className="text-lg font-bold text-white text-center pb-4 lg:pb-5">Leaderboard</h2>
      {leaderBoard.length === 0 ? (
        <p className="text-gray-400 text-center">No leaderboard data available.</p>
      ) : (
        <ul className="space-y-2">
          {leaderBoard.map((user, index) => (
            <li
              key={index}
              className={`flex justify-between rounded-md text-black py-1 lg:py-2`}
              // className={`flex justify-between p-2 rounded-md ${
              //   user.email === currentUser?.email
              //     ? "bg-[#8fde8b] text-black"
              //     : "text-gray-300"
              // }`}
            >
              <div>
                <span className="pr-4">{index + 1}.</span>
                <span>{user.username}</span>
              </div>
              <span>{user.score} pts</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    // <div className="bg-[#704337] px-6 py-2 rounded-md shadow-md w-full mx-auto">
    // {/* <div className="bg-transparent p-6 rounded-md shadow-md mx-auto"> */}
    //   <h2 className="text-lg font-bold text-white text-center pb-4">Leaderboard</h2>
    //   {leaderBoard.length === 0 ? (
    //     <p className="text-gray-400 text-center">No leaderboard data available.</p>
    //   ) : (
    //     <ul className="space-y-2">
    //       {leaderBoard.map((user, index) => (
    //         <li
    //           key={index}
    //           className={`flex justify-between px-2 rounded-md`}
    //           // className={`flex justify-between p-2 rounded-md ${
    //           //   user.email === currentUser?.email
    //           //     ? "bg-[#8fde8b] text-black"
    //           //     : "text-gray-300"
    //           // }`}
    //         >
    //           <span>{index + 1}. {user.username}</span>
    //           <span>{user.score} pts</span>
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
  )
}

export default LeaderBoard;