import React, { useEffect, useState } from "react";

const FULL_DASH_ARRAY = 283; // full circle circumference
const TIME_LIMIT = 25 * 60; // 25 minutes in seconds

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(TIME_LIMIT);
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const calculateProgress = () => {
    const rawTimeFraction = secondsLeft / TIME_LIMIT;
    return (rawTimeFraction * FULL_DASH_ARRAY).toFixed(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setSecondsLeft(TIME_LIMIT);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="relative w-64 h-64">
        <svg
          className="transform -rotate-90"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb" // Tailwind's gray-200
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#3b82f6" // Tailwind's blue-500
            strokeWidth="10"
            fill="none"
            strokeDasharray={FULL_DASH_ARRAY}
            strokeDashoffset={FULL_DASH_ARRAY - Number(calculateProgress())}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-800">
          {formatTime(secondsLeft)}
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={toggleTimer}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
