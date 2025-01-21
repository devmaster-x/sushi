import React, { useRef } from "react";

const MusicPage: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleButtonClick = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={handleButtonClick}>
        <img
          src="/assets/modal/buttons/start.png"
          alt="Start Button"
          style={styles.image}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        />
      </button>
      <audio ref={audioRef} loop>
        <source src="/assets/audio/BG14.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: 0,
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    border: "none",
    background: "none",
    cursor: "pointer",
  },
  image: {
    width: "100px",
    height: "100px",
    transition: "transform 0.3s",
  },
};

export default MusicPage;
