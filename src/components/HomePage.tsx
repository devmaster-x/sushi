import { Luckiest_Guy } from "next/font/google";

const luckiestGuy = Luckiest_Guy({ weight: "400", subsets: ["latin"] });

const SushiFarmTemplate = () => {
  return (
    <div className="font-sans">
      <section
        id="about"
        className="pt-10 text-center bg-cover h-screen bg-center flex flex-col justify-around items-center"
        style={{
          backgroundImage: "url('/assets/images/about-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <h2 className={`text-3xl md:text-4xl font-bold ${luckiestGuy.className} text-white`}>
            WELCOME TO TON BATTLEGROUND SEASON 1!
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-white mb-4 font-bold">
            January 30th - March 16th
          </p>
        </div>

        <div className="px-6 py-4 max-w-4xl mx-auto text-left">
          <ul className="list-disc pl-6 text-md text-gray-700 mb-6">
            <li>The first Multi-Player First-Person-Shooter Game built on Telegram and TON.</li>
            <li>Prize pool worth over $1M, comprised of in-game gold and $TBG tokens.</li>
            <li>Climb the individual leaderboard, participate in community tournaments.</li>
            <li>Complete quests, refer your friends, and rise to the top!</li>
          </ul>
          <div className="flex justify-center mb-6">
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg text-2xl font-semibold hover:bg-indigo-700 transition"
              onClick={() => (window.location.href = "./game")}
            >
              Join Now, Soldiers! 🔫
            </button>
          </div>
        </div>
        <div className="flex justify-center gap-12">
          <img
            src="/assets/images/sushi-1.png"
            alt="Sushi Character 1"
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg transform transition duration-300 hover:scale-110"
          />
          <img
            src="/assets/images/sushi-2.png"
            alt="Sushi Character 2"
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg transform transition duration-300 hover:scale-110"
          />
          <img
            src="/assets/images/sushi-3.png"
            alt="Sushi Character 3"
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg transform transition duration-300 hover:scale-110"
          />
        </div>
      </section>
    </div>
  );
};

export default SushiFarmTemplate;
