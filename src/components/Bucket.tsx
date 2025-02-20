import { useGameContext } from "src/context/gameContext";

const Bucket = () => {
  const {
    bucket,
    maxBucket,
    removeJokerPair
  } = useGameContext();

  return (
    <div className="bg-[#704337] p-1 rounded-xl shadow-md w-full">
      <div className="bg-[#704337] border-white border-2 p-4 rounded-xl shadow-md w-full flex justify-center">
        <div className="grid lg:grid-cols-5 grid-cols-8 gap-2 justify-start">
          {bucket.map((card, index) => (
            <div
              key={`b+${index}`}
              className={`w-8 h-8 lg:w-10 lg:h-10 bg-blue-400 rounded-md flex items-center justify-center bg-cover ${card.highlight ? 'border-2 border-white cursor-pointer' : ''}`}
              style={{ backgroundImage: `url(assets/sushi/${card.type == -1 ? 'Joker' : card.type + 1}.png)` }}
              onClick={() => { card.highlight && removeJokerPair(card.type) }}
            />
          ))}
          {Array.from({ length: maxBucket - bucket.length }).map((_, idx) => (
            <div key={`empty-${idx}`} className="w-8 h-8 lg:w-10 lg:h-10 bg-[#EDDEBC] rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Bucket;