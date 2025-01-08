import React from "react";
import { SessionProvider } from "next-auth/react"
import { GameProvider } from "src/context/gameContext";
import { GamePage } from "src/components";
import "src/styles/globals.css"

const App = () => {
  return (
    <SessionProvider>
      <GameProvider>
        <GamePage />
      </GameProvider>
    </SessionProvider>
  );
};

export default App;
