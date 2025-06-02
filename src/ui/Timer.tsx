import React, { useEffect, useState } from "react";

const FULL_DASH_ARRAY = 283; // Circumference of the circle
const WORK_DURATION = 10; // multiple by 60 (the number of minutes)
const BREAK_DURATION = 5;
const audio = new Audio("/bicyclebellsound.wav");

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const progress = (WORK_DURATION - secondsLeft) / WORK_DURATION; // 0 to 1

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && !isPaused && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (secondsLeft === 0) {
      audio.play();

      if (!isBreak) {
        // End work session → go to break
        setIsBreak(true);
        setIsRunning(false);
        setIsPaused(false);
        setSecondsLeft(BREAK_DURATION);
      } else {
        // End break → reset to work session
        setIsBreak(false);
        setIsRunning(false);
        setIsPaused(false);
        setSecondsLeft(WORK_DURATION);
      }
    }
  }, [secondsLeft, isBreak]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => setIsPaused(true);

  const continueTimer = () => setIsPaused(false);

  const endTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSecondsLeft(WORK_DURATION);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
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
            r="40"
            stroke="#e5e7eb"
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="var(--color-accent)"
            strokeWidth="1"
            fill="none"
            strokeDasharray={FULL_DASH_ARRAY}
            strokeDashoffset={FULL_DASH_ARRAY * (1 - progress)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-7xl font-semi-bold text-gray-800 h-[65px]">
            {formatTime(secondsLeft)}
          </div>
          <div className="mt-2 h-[10px] text-sm font-bold tracking-wide text-[var(--color-accent)]">
            {isBreak ? "you can relax now :)" : isPaused ? "Paused" : ""}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-10 h-[120px]">
        {!isRunning && !isPaused && !isBreak && (
          <button
            onClick={startTimer}
            className="text-white bg-[var(--color-accent)] hover:bg-[color:var(--color-accent-hover,#1e90ff)] rounded-full text-xl w-[180px] h-[50px] transition duration-200"
          >
            Start
          </button>
        )}

        {!isRunning && !isPaused && isBreak && (
          <button
            onClick={startTimer}
            className="bg-transparent border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white rounded-full text-xl w-[180px] h-[50px] transition duration-200 cursor-pointer"
          >
            Relax
          </button>
        )}

        {isRunning && !isPaused && (
          <button
            onClick={pauseTimer}
            className="bg-transparent border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white rounded-full text-xl w-[180px] h-[50px] transition duration-200"
          >
            Pause
          </button>
        )}

        {isRunning && isPaused && (
          <>
            <button
              onClick={continueTimer}
              className="text-white bg-[var(--color-accent)] hover:bg-transparent hover:text-[var(--color-accent)] hover:border-2 rounded-full border-[var(--color-accent)]rounded-full text-xl w-[180px] h-[50px] transition duration-200"
            >
              Continue
            </button>
            <button
              onClick={endTimer}
              className="bg-transparent border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white rounded-full text-xl w-[180px] h-[50px] transition duration-200"
            >
              End
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;
