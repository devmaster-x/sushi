import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Component() {
  const { data: session, update } = useSession();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SIGNED_IN") {
        update(); // Refresh session
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [update]);

  const popupCenter = (url: string, title: string) => {
    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop = window.screenTop ?? window.screenY;
    const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
    const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;
    const systemZoom = width / window.screen.availWidth;
    const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
    const top = (height - 550) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(
      url,
      title,
      `width=${500 / systemZoom},height=${550 / systemZoom},top=${top},left=${left}`
    );

    newWindow?.focus();
  };

  if (session) {
    return (
      <button
        className="bg-[#704337] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    );
  }
  
  return (
    <button
      className="bg-[#704337] hover:bg-[#3a3b4c] text-white px-4 py-3 rounded-md transition-colors duration-200 cursor-pointer"
      onClick={() => popupCenter("/google-signin", "Google Sign In")}
    >
      Sign in
    </button>
  );
}
