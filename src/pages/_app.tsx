import React from "react";
import { SessionProvider } from "next-auth/react"
import { GameProvider } from "src/context/gameContext";
import { GamePage } from "src/components";
import "src/styles/globals.css"

const App = () => {
  return (
    <SessionProvider>
      <GameProvider>
        <React.StrictMode>
          <GamePage />
        </React.StrictMode>
      </GameProvider>
    </SessionProvider>
  );
};

export default App;
