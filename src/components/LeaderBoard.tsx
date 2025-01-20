import { useGameContext } from "src/context/gameContext";
// import { useAppKitAccount } from "@reown/appkit/react";

const LeaderBoard = () => {
  const { 
    leaderBoard,
    currentUser 
  } = useGameContext();
  // const { address } = useAppKitAccount();

  return (
    <div className="bg-[#704337] rounded-lg p-2 shadow-lg w-full mx-auto relative pt-6 mt-14">
      <h2 
        className="absolute left-1/2 transform -translate-x-1/2 -top-7 text-lg font-bold text-white text-center bg-[#704337] w-fit rounded-full px-4 py-2"
        style={{
          width: "max-content",
          fontFamily: "Poppins, sans-serif"
        }}
      >
        All-Time High
      </h2>
      {leaderBoard.length === 0 ? (
        <p className="text-gray-400 text-center">No leaderboard data available.</p>
      ) : (
        <ul 
          className="space-y-1 p-3 bg-[#663333] rounded-xl"
          style={{
          width: "max-content",
          }}
        >
          {leaderBoard.map((user, index) => (
            <li
              key={index}
              className={`flex justify-between items-center rounded-lg text-black py-2 px-3 shadow-md bg-[#f5e4d8] ${
                index === 0
                  ? "bg-[#d4af37]" // First Place Style
                  : index === 1
                  ? "bg-[#c0c0c0]" // Second Place Style
                  : index === 2
                  ? "bg-[#cd7f32]" // Third Place Style
                  : ""
              }`}
            >
              {/* Rank and Username */}
              <div className="flex items-center">
                <span className="font-bold pr-4">{index + 1}.</span>
                <span className="truncate pr-6">{user.username}</span>
              </div>
              {/* Points */}
              <span className="font-semibold">{user.top_score} pts</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LeaderBoard;