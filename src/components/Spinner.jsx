// import axios from "axios";
// import React, { useState, useRef, useEffect } from "react";

// const API = `${import.meta.env.VITE_API_URL}/api/v1/spinner`;

// const Spinner = () => {
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [resultMessage, setResultMessage] = useState("");
//   const [rotation, setRotation] = useState(0);
//   const canvasRef = useRef(null);

//   const [prizes, setPrizes] = useState([]);

//   console.log("prizes", prizes);
//   const fetchPrizes = async () => {
//     try {
//       const res = await axios.get(`${API}/prizes`);
//       setPrizes(res.data[0]?.prizes);
//       console.log(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchPrizes();
//   }, []);

//   // const prizes = [
//   //   "$500",
//   //   "$100",
//   //   "LOSE",
//   //   "$200",
//   //   "$5000",
//   //   "JACKPOT",
//   //   "$50",
//   //   "$1000",
//   // ];

//   const radius = 150;
//   const segmentAngle = 360 / prizes.length; // Each segment is 45 degrees

//   // Get a random final rotation for the wheel to stop
//   const getRandomRotation = () => {
//     return Math.floor(Math.random() * 360) + 3600; // Random rotation, at least 10 full spins
//   };

//   // Determine the winning segment based on the final rotation
//   const getWinningSegment = (rotation) => {
//     const segmentIndex = Math.floor((rotation % 360) / segmentAngle);
//     return prizes[segmentIndex];
//   };

//   // Draw spinner and text using Canvas
//   const drawSpinner = (rotation) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;

//     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

//     // Set up the rotation of the spinner
//     ctx.save();
//     ctx.translate(centerX, centerY); // Move the context to the center of the canvas
//     ctx.rotate((rotation * Math.PI) / 180); // Rotate by the current degree

//     // Draw the segments
//     for (let i = 0; i < prizes?.length; i++) {
//       const angleStart = i * segmentAngle;
//       const angleEnd = angleStart + segmentAngle;
//       ctx.beginPath();
//       ctx.moveTo(0, 0); // Start from the center
//       ctx.arc(
//         0,
//         0,
//         radius,
//         (angleStart * Math.PI) / 180,
//         (angleEnd * Math.PI) / 180
//       ); // Draw the segment
//       ctx.lineTo(0, 0); // Back to center
//       ctx.fillStyle = i % 2 === 0 ? "#FF5733" : "#FFC300"; // Alternate colors
//       ctx.fill();

//       // Draw the text in the segment
//       ctx.save();
//       ctx.rotate(((angleStart + angleEnd) / 2) * (Math.PI / 180)); // Rotate to the center of the segment
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.font = "bold 16px Arial";
//       ctx.fillStyle = "white";
//       ctx.fillText(prizes[i], radius / 2, 0); // Draw text at the center of the segment
//       ctx.restore();
//     }

//     ctx.restore(); // Restore the rotation
//   };

//   // Spin animation logic
//   const spinWheel = () => {
//     if (isSpinning) return;

//     setIsSpinning(true);

//     const randomFinalRotation = getRandomRotation(); // Get random final rotation
//     let currentRotation = rotation;
//     let currentSpeed = 30; // Initial speed
//     let startTime = null;

//     // Animation function
//     const animate = (timestamp) => {
//       if (!startTime) startTime = timestamp; // Capture start time

//       // Calculate time elapsed
//       const elapsed = timestamp - startTime;
//       currentRotation += currentSpeed;
//       setRotation(currentRotation);

//       // Gradually reduce speed to simulate the slowing down
//       if (elapsed < 2000) {
//         // Spin for exactly 2 seconds
//         if (currentSpeed > 5) {
//           currentSpeed -= 0.5; // Slow down the speed gradually
//         }
//         requestAnimationFrame(animate); // Continue the animation
//       } else {
//         // Stop the animation after 2 seconds and determine the winner
//         const prize = getWinningSegment(currentRotation);
//         setResultMessage(`You won: ${prize}`);
//         setIsSpinning(false); // End the spinning
//       }
//     };

//     requestAnimationFrame(animate); // Start the animation
//   };

//   useEffect(() => {
//     drawSpinner(rotation); // Redraw the spinner each time the rotation changes
//   }, [rotation]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
//       <p className="mb-4 text-lg font-semibold">
//         {isSpinning ? "Spinning..." : "Click to Spin"}
//       </p>

//       {/* Spinner Canvas */}
//       <canvas
//         ref={canvasRef}
//         width={300}
//         height={300}
//         className="border-8 border-white rounded-full"
//       />

//       {/* Spin Button */}
//       <button
//         onClick={spinWheel}
//         disabled={isSpinning}
//         className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md disabled:bg-gray-500 hover:bg-blue-700 transition-colors"
//       >
//         Spin
//       </button>

//       {/* Result Message */}
//       {resultMessage && (
//         <p className="mt-6 text-xl font-semibold text-yellow-400">
//           {resultMessage}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Spinner;

import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

const API = `${import.meta.env.VITE_API_URL}/api/v1/spinner`;

const Spinner = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const [prizes, setPrizes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;

  // ✅ Fetch prizes from backend
  const fetchPrizes = async () => {
    try {
      const res = await axios.get(`${API}/prizes`);
      setPrizes(res.data[0]?.prizes || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateWithdrawalStatus = async (amount) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/wallet/update-deposite-transaction-status`,
        {
          status: "approved",
          // id: "transactionId",
          userId: userId,
          amount: parseInt(amount),
        }
      );

      if (response.status === 200) {
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction._id === transactionId
              ? { ...transaction, status }
              : transaction
          )
        );
      } else {
        console.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  useEffect(() => {
    fetchPrizes();

    // updateWithdrawalStatus(amount = "");
  }, []);

  const radius = 150;

  // ✅ Calculate dynamic segment angle
  const segmentAngle = prizes.length ? 360 / prizes.length : 360;

  const getRandomRotation = () => Math.floor(Math.random() * 360) + 3600;

  const getWinningSegment = (rotation) => {
    if (!prizes.length) return null;
    const normalizedRotation = rotation % 360; // Normalize to 0-359
    const index =
      Math.floor((360 - normalizedRotation) / segmentAngle) % prizes.length;
    return prizes[index];
  };

  const drawSpinner = (rotation) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    prizes.forEach((p, i) => {
      const angleStart = (i * 360) / prizes.length;
      const angleEnd = ((i + 1) * 360) / prizes.length;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(
        0,
        0,
        radius,
        (angleStart * Math.PI) / 180,
        (angleEnd * Math.PI) / 180
      );
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#FF5733" : "#FFC300";
      ctx.fill();

      // Draw prize text
      ctx.save();
      const textAngle = ((angleStart + angleEnd) / 2) * (Math.PI / 180);
      ctx.rotate(textAngle);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Arial";
      ctx.fillText(p, radius * 0.6, 0);
      ctx.restore();
    });

    ctx.restore();
  };

  const spinWheel = () => {
    if (isSpinning || !prizes.length) return;

    setIsSpinning(true);
    const finalRotation = getRandomRotation();
    let currentRotation = rotation;
    let speed = 30;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      currentRotation += speed;
      setRotation(currentRotation);

      // Slow down gradually
      if (elapsed < 4000) {
        if (speed > 0.5) speed *= 0.97; // Deceleration
        requestAnimationFrame(animate);
      } else {
        const prize = getWinningSegment(currentRotation);

        console.log(prize);
        if (prize && prize !== "LOSE") {
          updateWithdrawalStatus(prize);
        }
        setResultMessage(`🎉 You won: ${prize}`);
        setIsSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    drawSpinner(rotation);
  }, [rotation, prizes]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
      <p className="mb-4 text-lg font-semibold">
        {isSpinning ? "Spinning..." : "Click to Spin"}
      </p>

      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="border-8 border-white rounded-full"
      />

      <button
        onClick={spinWheel}
        disabled={isSpinning || !prizes.length}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md disabled:bg-gray-500 hover:bg-blue-700 transition-colors"
      >
        Spin
      </button>

      {resultMessage && (
        <p className="mt-6 text-xl font-bold text-yellow-400">
          {resultMessage}
        </p>
      )}
    </div>
  );
};

export default Spinner;
