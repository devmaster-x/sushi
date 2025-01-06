import { useGameContext } from "src/context/gameContext";

const CardBoard = () => {
  const {
    cards,
    topCards,
    hintCards,
    isHint,
    cardBoardWidth,
    resetHintCards,
    handleCardClick,
  } = useGameContext();

  if(isHint) return (
    <div
      className="relative bg-[#E8F5E9] rounded-lg shadow-md overflow-hidden mx-auto"
      style={{
        width: cardBoardWidth,
        height: cardBoardWidth,
      }}
      onClick={ resetHintCards }
    >
      {topCards.map((card, index) => (
        <div
          key={index}
          className={`absolute rounded-md bg-[#EEEEEE] shadow-[0px_5px_5px_rgba(0,0,0,0.9),_0px_2px_2px_rgba(0,0,0,0.4)] cursor-pointer"
          }`}
          style={{
            top: `${card.top + card.offset}px`,
            left: `${card.left + card.offset}px`,
            width: `39px`,
            height: `39px`,
            zIndex: 1,
          }}
        >
          <div
            className="absolute inset-0 bg-cover rounded-md"
            style={{
              backgroundImage: `url(assets/sushi/${card.type + 1}.png)`,
              // filter:' brightness(0.4)',
              opacity: 0.4
            }}
          />
        </div>
      ))}
      {hintCards.map((card, index) => (
        <div
          key={index}
          className={`absolute rounded-md bg-green-300 shadow-[0px_5px_5px_rgba(0,0,0,0.9),_0px_2px_2px_rgba(0,0,0,0.4)] cursor-pointer"
          }`}
          style={{
            top: `${card.top + card.offset}px`,
            left: `${card.left + card.offset}px`,
            width: `39px`,
            height: `39px`,
            zIndex: 2,
          }}
        >
          <div
            className="absolute inset-0 bg-cover rounded-md"
            style={{
              backgroundImage: `url(assets/sushi/${card.type + 1}.png)`,
            }}
          />
        </div>
      ))}
    </div>
  )
  return (
      <div
        className="relative bg-[#E8F5E9] rounded-lg shadow-md overflow-hidden mx-auto"
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
              top: `${card.top + card.offset}px`,
              left: `${card.left + card.offset}px`,
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
