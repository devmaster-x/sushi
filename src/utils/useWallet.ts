// useWallet.ts
import { useEffect, useState } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';

const useWallet = () => {
  const [isVIP, setIsVIP] = useState<boolean | null>(null);
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    if (isConnected && address) {
      // Check if wallet is VIP (based on NFT ownership)
      checkVIPStatus(address);
    }
  }, [isConnected, address]);

  const checkVIPStatus = async (address: string) => {
    try {
      const response = await fetch(`http://localhost:5000/check-vip/${address}`);
      const data = await response.json();
      setIsVIP(data.isVIP);
    } catch (error) {
      console.error('Error checking VIP status:', error);
      setIsVIP(false); // Default to normal user if error occurs
    }
  };

  return { address, isConnected, isVIP };
};

export default useWallet;
