import { useRef } from "react";
import { Luckiest_Guy } from "next/font/google";

const luckiestGuy = Luckiest_Guy({ weight: "400", subsets: ["latin"] });

const SushiFarmTemplate = () => {
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  const handleLearnMoreClick = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/hero-bg.png')" }}>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${luckiestGuy.className}`}>
            Adopt. Nurture. Level Up Your Sushi Squad!
          </h1>
          <p className="text-lg md:text-xl mb-6">
            The ultimate meme game with AI-powered care, built on Base and Solana.
          </p>
          <div className="flex gap-4">
            <a
              href="/"
              className="bg-supernova text-dark-slate-blue px-6 py-3 rounded-lg text-lg font-semibold hover:bg-dark-slate-blue hover:text-supernova"
            >
              Play Now
            </a>
            <button
              onClick={handleLearnMoreClick}
              className="bg-orange-300 text-dark-slate-blue px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-400"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Gameplay Features Section */}
      <section id="about" ref={aboutSectionRef} className="py-20 bg-gray-100 text-center bg-cover relative h-screen bg-center items-center flex flex-col justify-center" style={{ backgroundImage: "url('/assets/images/about-bg.png')" }}>
        <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${luckiestGuy.className}`}>
          Welcome to the Sushi World!
        </h2>
        <p className="text-lg md:text-xl max-w-4xl mx-auto mb-8">
          Dive into the fun and excitement of Sushi Farm! Adopt unique sushi characters, nurture them with the help of AI-powered agents, and explore a world built on Base and Solana blockchain.
        </p>
        <div className="flex justify-center gap-8">
          <img src="/assets/images/sushi-1.png" alt="Sushi Character 1" className="w-40 h-40" />
          <img src="/assets/images/sushi-2.png" alt="Sushi Character 2" className="w-40 h-40" />
          <img src="/assets/images/sushi-3.png" alt="Sushi Character 3" className="w-40 h-40" />
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-20 bg-gray-100 text-center bg-cover relative h-screen bg-center items-center flex flex-col justify-center" style={{ backgroundImage: "url('/assets/images/collecting.png')" }}>
        <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${luckiestGuy.className}`}>
          Collect & Trade Sushi Characters
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Explore our in-game marketplace to buy, sell, or trade your sushi characters and items. Seamlessly integrated with wallets supporting Base and Solana.
        </p>
        <a href="/marketplace" className="bg-supernova text-dark-slate-blue px-8 py-3 rounded-lg text-2xl underline font-semibold hover:bg-dark-slate-blue hover:text-supernova">
          Explore Marketplace
        </a>

        <h2 className={`text-4xl md:text-5xl font-bold my-8 ${luckiestGuy.className}`}>
          Join Our Sushi Squad
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Be part of the Sushi Farm community! Join us on Discord, follow us on Twitter, and participate in tournaments and leaderboards.
        </p>
        <div className="flex justify-center gap-6">
          <a href="https://discord.gg/yjnqnUJmYe" target="_blank" rel="noopener noreferrer">
            <img src="https://www.sushifarm.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ficon-discord.924d890d.png&w=384&q=75" alt="Discord" className="w-12 h-12" />
          </a>
          <a href="https://x.com/playsushifarm" target="_blank" rel="noopener noreferrer">
            <img src="https://www.sushifarm.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ficon_twitter_x.85fd6219.png&w=256&q=75" alt="Twitter" className="w-12 h-12" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-dark-slate-blue text-white text-center">
        <div className="mb-6">
          <a href="/" className="text-lg mr-4">Home</a>
          <a href="#about" className="text-lg  mr-4">About</a>
          <a href="/marketplace" className="text-lg mr-4">Marketplace</a>
          <a href="#roadmap" className="text-lg mr-4">Roadmap</a>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Sushi Farm. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default SushiFarmTemplate;
