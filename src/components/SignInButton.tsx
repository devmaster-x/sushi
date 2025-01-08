import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if(session) {
    return <button 
        className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={() => signOut()}
      >
        Sign out
      </button>
  }
  return <button 
    className="bg-[#2a2b3c] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
    onClick={() => signIn()}
  >
    Sign in
  </button>
}