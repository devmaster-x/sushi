import React, { useState, useEffect } from "react";

const BackgroundMusic: React.FC = () => {
const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
const [isPlaying, setIsPlaying] = useState(false);

useEffect(() => {
const audio = new Audio('/assets/audio/BG14.wav');
audio.loop = true; // Enable seamless looping
setBackgroundMusic(audio);

const handleMouseMove = async () => {
if (!isPlaying && audio) {
try {
await audio.play();
setIsPlaying(true); // Audio is now playing
document.removeEventListener("mousemove", handleMouseMove); // Remove the listener after the first interaction
} catch (error) {
console.warn("Autoplay failed:", error);
}
}
};


document.addEventListener("mousemove", handleMouseMove);


return () => {
document.removeEventListener("mousemove", handleMouseMove);
};
}, [isPlaying]);

return (
<div>
{/* Optional: Message displayed until music starts */}
{!isPlaying && <p>Move your mouse to start the background music!</p>}
</div>
);
};

export default BackgroundMusic;