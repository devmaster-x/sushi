import { useGameContext } from "src/context/gameContext";

const CardBoard = () => {
  const {
    cards,
    topCards,
    hintCards,
    isHint,
    cardBoardWidth,
    layerNumber,
    currentRound,
    resetHintCards,
    handleCardClick,
  } = useGameContext();

  if(isHint) return (
    <div
      className="bg-[#d5fbff] rounded-2xl shadow-md overflow-hidden mx-auto border-[#b1dedd] border-4"
      style={{
        width: cardBoardWidth,
        height: cardBoardWidth,
      }}
    >
      <div
        className="relative bg-[#b4f6ff] rounded-2xl overflow-hidden mx-auto border-spacing-4 mt-2"
        style={{
          width: cardBoardWidth - 24,
          height: cardBoardWidth - 24,
        }}
        onClick={ resetHintCards }
      >
        <div className="top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          {layerNumber != 0 && <p className="text-6xl text-gray-400">{layerNumber+1}</p> }
        </div>
        {topCards.map((card, index) => (
          <div
            key={`t+${index}`}
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
                backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
                // filter:' brightness(0.4)',
                opacity: 0.4
              }}
            />
          </div>
        ))}
        {hintCards.map((card, index) => (
          <div
            key={`h+${index}`}
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
                backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
              }}
            />
          </div>
        ))}
      </div>
      </div>
    )
    return (
      <div
        className="bg-[#d5fbff] rounded-2xl shadow-md overflow-hidden mx-auto border-[#b1dedd] border-4"
        style={{
          width: cardBoardWidth,
          height: cardBoardWidth,
        }}
      >
        <div
          className="relative bg-[#b4f6ff] rounded-2xl overflow-hidden mx-auto mt-2"
          style={{
            width: cardBoardWidth - 24,
            height: cardBoardWidth - 24,
          }}
        >
          {cards.map((card, index) => (
            <div
              key={`c+${index}`}
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
                  backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)`,
                  filter: card.state === "available" ? "brightness(1)" : "brightness(0.4)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
  );
};

export default CardBoard;
