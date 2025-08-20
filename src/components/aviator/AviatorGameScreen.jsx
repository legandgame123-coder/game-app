import React, { useEffect, useRef, useState } from "react";
import { useAviatorSocket } from "../../context/AviatorSocketContext";
import MovingDotsCircle from "./MovingDotsCircle"
import { getUserBets } from "../../services/aviatorApi";
import HistorySection from "./HistorySection";

export default function AviatorGameScreen() {
  const { socket, isConnected, multiplier, crashPoint, isRunning, liveBets, topBets, hasBet, setHasBet } =
    useAviatorSocket();
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user._id
  const [bet, setBet] = useState(10);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [activeTab, setActiveTab] = useState('bets');
  const [userBets, setUserBets] = useState([]);

  useEffect(() => {
    fetchUserBets();
  }, [multiplier]);

  const fetchUserBets = async () => {
      try {
        const response = await getUserBets(userId);
        if (response.data.success) {
          setUserBets(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };

  const canvasRef = useRef(null);

  const VIEW_W = 700;
  const VIEW_H = 300;
  const PAD = 24;

  const planeImg = useRef(new Image());
  planeImg.current.src =
    "./aviator.png";

  // Function to get Y coordinate from X (exponential curve)
  const getCurveY = (x, curveStrength = 2.6) => {
    const x0 = PAD;
    const x1 = VIEW_W - PAD;
    const y0 = VIEW_H - PAD;
    const yTop = PAD + 18;
    const t = (x - x0) / (x1 - x0);
    if (t < 0) return y0;
    const eMax = Math.exp(curveStrength) - 1;
    const e = (Math.exp(curveStrength * t) - 1) / eMax;
    return y0 - (y0 - yTop) * e;
  };

  // Draw curve and plane on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = VIEW_W;
    canvas.height = VIEW_H;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Base axis line
      ctx.beginPath();
      ctx.moveTo(PAD, VIEW_H - PAD);
      ctx.lineTo(VIEW_W - PAD, VIEW_H - PAD);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Collect curve points up to current multiplier progress
      const points = [];
      const maxX =
        PAD +
        (VIEW_W - PAD * 2) *
        Math.min(multiplier / 5, 1); // scale with multiplier, cap at screen end
      for (let x = PAD; x <= maxX; x += 2) {
        points.push({ x, y: getCurveY(x) });
      }

      if (points.length > 1) {
        // Fill under curve
        ctx.beginPath();
        ctx.moveTo(points[0].x, VIEW_H - PAD);
        points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, VIEW_H - PAD);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,60,60,0.1)";
        ctx.fill();

        // Draw curve
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = "rgba(255,60,60,1)";
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(255,60,60,0.6)";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw plane
        const planePos = points[points.length - 1];
        const planeSize = 70;
        ctx.drawImage(
          planeImg.current,
          planePos.x - planeSize / 2,
          planePos.y - planeSize / 2,
          planeSize,
          planeSize
        );
      }
    };

    draw();
  }, [multiplier, isRunning]);

  const handlePlaceBet = async () => {
    if (!isConnected || hasBet) return;

    try {
      console.log(userId, bet)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/aviator/bet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // ensure `user` is available in context
          amount: bet,
        }),
      });

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bet');
      }

      setHasBet(true);
      setHasCashedOut(false);
      // Optionally show a toast or UI feedback
    } catch (error) {
      console.error('Error placing bet:', error.message);
      // Optionally show error to the user
    }
  };


  const handleCashOut = async () => {
    if (!isConnected || !hasBet || hasCashedOut) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/aviator/cashout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // make sure `user` is available
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Cash out failed');
      }

      setHasCashedOut(true);
      // Optionally: show success message or winnings
      // e.g., show `data.winnings` or `data.multiplier`

    } catch (error) {
      console.error('Error during cash out:', error.message);
      // Optionally show an error notification to the user
    }
  };


  const getPotentialWin = () => (bet * multiplier).toFixed(2);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-auto bg-gray-900 text-white">
      {/* GAME AREA */}
      <div className="relative w-full max-w-5xl h-72 bg-gray-800 rounded-lg overflow-hidden">
        {/* <div className="absolute left-[-80px]"><MovingDotsCircle /> </div>
        <div className="absolute right-0"><MovingDotsCircle /> </div> */}
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            backgroundColor: "#1e1e1e",
          }}
        />

        {/* Overlays */}
        {!isRunning && crashPoint ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-red-500 text-2xl font-bold">
              💥 Crashed at {crashPoint.toFixed(2)}x
            </p>
          </div>
        ) : !isRunning ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400">Waiting for next round...</p>
          </div>
        ) : null}

        {/* big multiplier */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-4xl font-extrabold text-red-400 drop-shadow">
          {multiplier.toFixed(2)}x
        </div>
      </div>

      {/* stats */}
      <div className="mt-6 flex space-x-8 text-xl">
        <p className="font-bold text-green-400">{multiplier.toFixed(2)}x</p>
        <p className="font-bold text-yellow-400">${getPotentialWin()}</p>
      </div>

      {/* controls */}
      <div className="mt-8 flex items-center space-x-4">
        <input
          type="number"
          min="1"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          className="w-24 p-2 rounded bg-gray-700 text-center"
        />
        {!hasBet ? (
          <button
            onClick={handlePlaceBet}
            // disabled={!isConnected || isRunning || hasBet}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Place Bet
          </button>
        ) : !hasCashedOut ? (
          <button
            onClick={handleCashOut}
            disabled={!isRunning}
            className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            Cash Out
          </button>
        ) : (
          <button
            disabled
            className="px-4 py-2 bg-gray-600 rounded opacity-50"
          >
            Bet Closed
          </button>
        )}
      </div>

      <HistorySection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveBets={liveBets}
        userBets={userBets}
      />
    </div>
  );
}
