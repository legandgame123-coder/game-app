import React, { useState, useEffect } from "react";

export default function MovingDotsCircle() {
  const [isMoving, setIsMoving] = useState(true);
  const dotCount = 12;
  const radius = 120;
  const containerHeight = 300;

  // Each dot has its own offset
  const [dotOffsets, setDotOffsets] = useState(
    Array.from({ length: dotCount }, (_, i) => i * 25) // staggered initial positions
  );

  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setDotOffsets((prev) =>
        prev.map((offset) => (offset > containerHeight ? 0 : offset + 2)) // loop upward
      );
    }, 50); // smooth speed

    return () => clearInterval(interval);
  }, [isMoving]);

  return (
    <div className="flex flex-col">
      {/* Container */}
      <div className="relative w-[120px] h-[300px]">
        {/* Curved Red Trail */}
        {/* <div className="absolute w-full h-full left-30 rounded-full border-l-[4px] border-red-600 opacity-50" /> */}

        {/* Moving Dots */}
        {dotOffsets.map((offset, i) => {
        //   const angle = (Math.PI * i) / (dotCount - 1); // spread dots evenly on 180° arc
          const x = radius * Math.sin(90) * 0.4; // scaled X offset for curve
          const y = radius * Math.cos(0); // base Y position

          return (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_6px_white]"
              style={{
                left: `calc(50% + ${x}px)`,
                bottom: `${(y + offset) % containerHeight}px`,
                transform: "translateX(-50%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
