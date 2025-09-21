import { useEffect } from "react";
import GameBoard from "../components/color/GameBoard";
import Timer from "./Timer";

function Color() {
  useEffect(() => {
    const audio = new Audio("/main.mp3");
    audio.loop = true;
    audio.play().catch((err) => {
      console.error("Autoplay failed:", err);
    });
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#160003] text-white">
      {/* GameBoard in background */}
      <GameBoard />
    </div>
  );
}

export default Color;
