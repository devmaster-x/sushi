import React from "react";
import { GameProvider } from "src/context/gameContext";
import { GameUI, GamePage } from "src/components";
import "src/styles/globals.css"

const App = () => {
  return (
    <GameProvider>
      {/* <GameUI />
       */}
       <GamePage />
    </GameProvider>
  );
};

export default App;
