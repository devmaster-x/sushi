import { useGameContext } from "src/context/gameContext";

const CardBoard = () => {
  const {
    cards,
    cardBoardWidth,
    handleCardClick,
  } = useGameContext();

  return (
      <div
        className="relative bg-[#B2E0FF] rounded-lg shadow-md overflow-hidden mx-auto"
        style={{
          width: cardBoardWidth,
          height: cardBoardWidth,
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={`absolute rounded-md ${
              card.state === "available"
                ? "bg-[#EEEEEE] shadow-[0px_5px_5px_rgba(0,0,0,0.9),_0px_2px_2px_rgba(0,0,0,0.4)] cursor-pointer"
                : "bg-gray-600"
            }`}
            style={{
              top: `${card.top}px`,
              left: `${card.left}px`,
              width: `39px`,
              height: `39px`,
              zIndex: card.zIndex,
            }}
            onClick={() => card.state === "available" && handleCardClick(card)}
          >
            <div
              className="absolute inset-0 bg-cover rounded-md"
              style={{
                backgroundImage: `url(assets/sushi/${card.type + 1}.png)`,
                filter: card.state === "available" ? "brightness(1)" : "brightness(0.4)",
              }}
            />
          </div>
        ))}
      </div>
  );
};

export default CardBoard;
