// pages/_app.tsx
import { useEffect, useState } from "react";
import { createAppKit, useAppKitAccount } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { Card, LeaderBoard } from 'src/components'

export default function App({ }) {
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
    <div>
      <h1>Match Sushi Cards</h1>
      <appkit-button />
      
      {!isConnected ? (
        <>
          <p>Please connect your wallet to continue.</p>
        </>
      ) : (
        <>
          <LeaderBoard />
          <div>
            {/* <Card /> Display Cards when connected */}
          </div>
        </>
      )}
    </div>
  );
}
