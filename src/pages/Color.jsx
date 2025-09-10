import { useEffect } from "react";
import GameBoard from "../components/color/GameBoard";

function Color() {
  // useEffect(() => {
  //   const audio = new Audio("/main.mp3");
  //   audio.loop = true; // Loop the sound
  //   audio.play().catch((err) => {
  //     console.error("Autoplay failed:", err);
  //   });

  //   return () => {
  //     audio.pause();
  //     audio.currentTime = 0; // Reset if needed
  //   };
  // }, []);

  return (
    <div className="min-h-screen bg-[#160003] text-white">
      <GameBoard />
    </div>
  );
}

export default Color;
