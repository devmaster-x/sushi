// registerUser.tsx
import { useEffect } from 'react';
import useWallet from './useWallet';

const RegisterUser = () => {
  const { address, isVIP, isConnected } = useWallet();

  useEffect(() => {
    if (isConnected && address && isVIP !== null) {
      const registerUser = async () => {
        const userData = {
          address,
          vip: isVIP,
          score: 0,
        };

        try {
          const response = await fetch('http://localhost:5000/register-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (response.ok) {
            console.log('User registered');
          } else {
            console.error('Failed to register user');
          }
        } catch (error) {
          console.error('Error registering user:', error);
        }
      };

      registerUser();
    }
  }, [isConnected, address, isVIP]);

  return null;
};

export default RegisterUser;
