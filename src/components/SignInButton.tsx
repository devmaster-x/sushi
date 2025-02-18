// import { useSession, signIn, signOut } from "next-auth/react"


// export default function Component() {
//   const { data: session } = useSession()

//   if (session) {
//     return <button
//       className="bg-[#704337] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
//       onClick={() => signOut()}
//     >
//       Sign out
//     </button>
//   }
//   return <button
//     className="bg-[#704337] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
//     onClick={() => signIn()}
//   >
//     Sign in
//   </button>
// }

import { type LogtoContext } from '@logto/next';
import useSWR from 'swr';

const Home = () => {
  const { data } = useSWR<LogtoContext>('/api/logto/user');

  return (
    <nav>
      {data?.isAuthenticated ? (
        <p>
          Hello, {data.claims?.sub},
          <button
            onClick={() => {
              window.location.assign('/api/logto/sign-out');
            }}
          >
            Sign Out
          </button>
        </p>
      ) : (
        <p>
          <button
            onClick={() => {
              window.location.assign('/api/logto/sign-in');
            }}
          >
            Sign In
          </button>
        </p>
      )}
    </nav>
  );
};

export default Home;