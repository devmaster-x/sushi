import React from "react";
import { SessionProvider } from "next-auth/react";
import { GameProvider } from "src/context/gameContext";
import "src/styles/globals.css";

export default function App({ Component, pageProps }: any) {
  return (
    <SessionProvider>
      <GameProvider>
        <React.StrictMode>
          <Component {...pageProps} />
        </React.StrictMode>
      </GameProvider>
    </SessionProvider>
  );
}
