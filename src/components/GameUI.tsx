// pages/_app.tsx
import { useEffect, useState } from "react";
import { createAppKit, useAppKitAccount } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { GameInfo, GameBoard, ControlButtons, LeaderBoard } from 'src/components'

export default function GameUI({ }) {
  const { address, isConnected } = useAppKitAccount()

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ''
    createAppKit({
      adapters: [new EthersAdapter()],
      networks: [mainnet, arbitrum],
      projectId,
      themeMode: 'light'
    })
  }, [isConnected, address]);

  return (
    <div className="w-full h-full">
      {!isConnected ? (
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-2xl font-semibold">Match Sushi Cards</h1>
          <appkit-button />
          <p>Please connect your wallet to continue.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-around my-6 w-full">
            <h1 className="text-2xl font-semibold">Match Sushi Cards</h1>
            <appkit-button />
          </div>
          <GameInfo />
          <GameBoard />
          <ControlButtons />
          <LeaderBoard />
        </>
      )}
    </div>
  );
}
