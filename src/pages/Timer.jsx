import React, { useEffect, useState } from "react";

export default function Timer({ timeLeft }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    // run only when parent sets timeLeft to 5
    if (timeLeft !== 5) return;

    setTime(5); // reset to 5

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // stop at 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // hide once countdown hits 0
  if (timeLeft ===  0 || timeLeft > 5) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="flex space-x-2">
        {String(timeLeft)
          .padStart(2, "0")
          .split("")
          .map((digit, idx) => (
            <div
              key={idx}
              className="bg-blue-900 text-cyan-400 font-bold text-9xl flex items-center justify-center rounded-2xl w-32 h-48 shadow-lg"
            >
              {digit}
            </div>
          ))}
      </div>
    </div>
  );
}
