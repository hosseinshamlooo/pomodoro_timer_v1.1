import React, { useEffect, useState } from "react";

const FULL_DASH_ARRAY = 283; // Circumference of the circle
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

  const progress = (TIME_LIMIT - secondsLeft) / TIME_LIMIT; // 0 to 1

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

  return (
    <div className="flex flex-col items-center justify-center h-screen pt-30">
      <div className="relative w-120 h-130">
        <svg
          className="transform -rotate-90"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="36"
            stroke="#e5e7eb" // gray-200
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="36"
            stroke="var(--color-accent)" // accent color
            strokeWidth="1"
            fill="none"
            strokeDasharray={FULL_DASH_ARRAY}
            strokeDashoffset={FULL_DASH_ARRAY * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-6xl font-semi-bold text-gray-800">
          {formatTime(secondsLeft)}
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={toggleTimer}
          className="bg-blue-500 text-white rounded-full hover:bg-blue-600 transition text-xl inline-block w-[180px] h-[50px] px-6 py-2"
          style={{ background: "var(--color-accent)" }}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>
    </div>
  );
};

export default Timer;
