import React from "react";

interface CardProps {
  card: {
    id: number;
    type: number;
    state: "available" | "unavailable";
    top: number;
    left: number;
    zIndex?: number;
  };
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ card, onClick }) => {
  return (
    <div
      className="card absolute transition-transform transform cursor-pointer"
      style={{
        backgroundImage: `url(assets/sushi/${card.type + 1}.png)`,
        top: `${card.top}px`,
        left: `${card.left}px`,
        width: '40px',
        height: '40px',
        zIndex: card.zIndex || 1, // Default z-index is 1
      }}
      onClick={onClick}
    ></div>
  );
};

export default Card;
