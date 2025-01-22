import React, { useState, useEffect } from "react";

const BackgroundMusic: React.FC = () => {
const [isPlaying, setIsPlaying] = useState(false);
const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);

useEffect(() => {
const audio = new Audio('/assets/audio/BG14.wav');
audio.loop = true; // Enable seamless looping
setBackgroundMusic(audio);
}, []);

const handlePlay = () => {
if (backgroundMusic) {
backgroundMusic.play().then(() => {
setIsPlaying(true);
}).catch((error) => {
console.error("Playback error:", error);
});
}
};

const handlePause = () => {
if (backgroundMusic) {
backgroundMusic.pause();
setIsPlaying(false);
}
};

return (

<button onClick={isPlaying ? handlePause : handlePlay}>
{isPlaying ? "Pause Music" : "Play Music"}
</button>

);
};

export default BackgroundMusic;