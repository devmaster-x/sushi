import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function AuthButton() {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/auth/session"); // Ensures session updates
    }
  }, [status]);

  if (session) {
    return (
      <button
        className="bg-[#704337] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={async () => {
          await signOut({ callbackUrl: "/" }); // Ensure full signout
          update(); // Force re-fetch session
        }}
      >
        Sign out
      </button>
    );
  }
  return (
    <button
      className="bg-[#704337] hover:bg-[#3a3b4c] text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
      onClick={() => signIn("google")}
    >
      Sign in
    </button>
  );
}
