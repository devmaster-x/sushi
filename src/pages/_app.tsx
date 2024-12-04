import React from "react";
import { GameProvider } from "src/context/gameContext";
import { GamePage } from "src/components";
import "src/styles/globals.css"

const App = () => {
  return (
    <GameProvider>
       <GamePage />
    </GameProvider>
  );
};

export default App;
