import { useGameContext } from "src/context/gameContext";

const CardBoard = () => {
  const {
    cards,
    cardBoardWidth,
    handleCardClick,
  } = useGameContext();

  return (
    <div
      className="relative mt-4 bg-gray-700 rounded-lg shadow-md overflow-hidden"
      style={{
        width: cardBoardWidth,
        height: cardBoardWidth,
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className={`absolute bg-cover rounded-sm ${
            card.state === "available" ? "bg-green-600" : "bg-gray-600"
          }`}
          style={{
            top: `${card.top}px`,
            left: `${card.left}px`,
            width: `39px`,
            height: `39px`,
            zIndex: card.zIndex,
          }}
          onClick={()=>handleCardClick(card)}
        >
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url(assets/sushi/${card.type + 1}.png)`,
              opacity: card.state === "available" ? 1 : 0.5,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default CardBoard;