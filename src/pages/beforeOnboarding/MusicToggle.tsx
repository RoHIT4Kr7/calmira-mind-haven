import React, { useEffect, useRef, useState } from "react";

const MusicToggle: React.FC = () => {
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play().catch(() => {
      setPlaying(false);
    });
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="audio/background.mp3"
        loop
        autoPlay
      ></audio>
      <button
        id="music-btn"
        className={playing ? "on" : "off"}
        aria-label="Toggle background music"
        onClick={toggleMusic}
      />
    </>
  );
};

export default MusicToggle;
