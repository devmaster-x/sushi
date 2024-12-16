import { useGameContext } from "src/context/gameContext";

const Bucket = () => {
  const {
    bucket,
  } = useGameContext();

  return (
    <div className="bg-[#252635] p-2 py-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold text-gray-200 text-center mb-2">Bucket</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {bucket.map((card) => (
          <div
            key={card.id}
            className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center bg-cover"
            style={{ backgroundImage: `url(assets/sushi/${card.type + 1}.png)` }}
          />
        ))}
        {Array.from({ length: 7 - bucket.length }).map((_, idx) => (
          <div key={`empty-${idx}`} className="w-10 h-10 bg-gray-500 rounded-md" />
        ))}
      </div>
    </div>
  )
}

export default Bucket;