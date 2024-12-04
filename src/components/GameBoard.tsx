import React from "react";
import { useGameContext } from "src/context/gameContext"; 
import Card from "./Card";

const GameBoard: React.FC = () => {
  const {
    cards,
    bucket,
    additionalSlots,
    handleCardClick,
  } = useGameContext();

  // For better positioning of cards in bucket and slots
  const cardSpacing = 100; // Control the space between cards (horizontal/vertical)
  
  return (
    <div className="w-full flex flex-col items-center mt-12">
      {/* Game Board */}
      <div className="w-4/5 h-[600px] relative mx-auto">
        {/* Render cards on the game board */}
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={{
              ...card,
              top: card.top, // Adjust as per game logic
              left: card.left, // Adjust as per game logic
            }}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {/* Bucket and Additional Slots */}
      <div className="w-4/5 mx-auto flex justify-around mt-8">
        {/* Bucket */}
        <div className="bucket w-1/2 h-[80px] flex flex-col justify-start items-center p-2 bg-gray-200 rounded-lg relative">
          <h4 className="font-semibold text-center text-lg mr-2 mb-4">Bucket</h4>
          {/* Render cards inside bucket */}
          {bucket.map((card, index) => (
            <div
              key={card.id}
              className="card transition-transform transform cursor-pointer"
              style={{
                backgroundImage: `url(assets/sushi/${card.type + 1}.png)`,
                width: '40px',
                height: '40px',
              }}
              // onClick={onClick}
            ></div>
          ))}
        </div>

        {/* Additional Slots */}
        <div className="slots w-1/2 h-[80px] flex flex-col justify-start items-center p-2 bg-gray-200 rounded-lg relative">
          <h4 className="font-semibold text-center text-lg mr-2 mb-4">Additional Slots</h4>
          {/* Render cards inside additional slots */}
          {additionalSlots.map((card, index) => (
            <div
              key={card.id}
              className="card transition-transform transform cursor-pointer"
              style={{
                backgroundImage: `url(assets/sushi/${card.type + 1}.png)`,
                width: '40px',
                height: '40px',
              }}
              // onClick={onClick}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
