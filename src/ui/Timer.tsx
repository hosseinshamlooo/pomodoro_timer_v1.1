import React, { useEffect, useState, useCallback, useRef } from "react";

const FULL_DASH_ARRAY = 283;
const WORK_DURATION = 5; // in seconds
const BREAK_DURATION = 3;

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [duration, setDuration] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(true);
  const [timerFinished, setTimerFinished] = useState(false);
  const [justSwitchedWork, setJustSwitchedWork] = useState(false);
  const [justSwitchedBreak, setJustSwitchedBreak] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format seconds as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Progress from 0 to 1
  const progress = timerFinished
    ? 1
    : isRunning
    ? 1 - secondsLeft / duration
    : 0;

  const breakProgress = isRunning && isBreak ? 1 - secondsLeft / duration : 0;

  useEffect(() => {
    audioRef.current = new Audio("/bicyclebellsound.wav");
  }, []);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          audioRef.current?.play();
          setTimerFinished(true);

          const nextIsBreak = !isBreak;
          const nextDuration = nextIsBreak ? BREAK_DURATION : WORK_DURATION;

          setIsBreak(nextIsBreak);
          setDuration(nextDuration);
          setSecondsLeft(nextDuration);
          setIsRunning(false);

          if (nextIsBreak) {
            setJustSwitchedBreak(true);
            setJustSwitchedWork(false);
          } else {
            setJustSwitchedWork(true);
            setJustSwitchedBreak(false);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, isBreak]);

  useEffect(() => {
    if (justSwitchedWork) {
      const timeout = setTimeout(() => setJustSwitchedWork(false), 50);
      return () => clearTimeout(timeout);
    }
  }, [justSwitchedWork]);

  useEffect(() => {
    if (justSwitchedBreak) {
      const timeout = setTimeout(() => setJustSwitchedBreak(false), 50);
      return () => clearTimeout(timeout);
    }
  }, [justSwitchedBreak]);

  // Helper functions for styles
  const getTransitionStyle = (justSwitched: boolean) =>
    justSwitched ? "none" : "stroke-dashoffset 1s linear";

  const getOpacity = (active: boolean) => (active ? 1 : 0);

  // Memoized handlers
  const startWork = useCallback(() => {
    setJustSwitchedWork(true); // Block transition for this render

    requestAnimationFrame(() => {
      setTimerFinished(false);
      setIsBreak(false);
      setDuration(WORK_DURATION);
      setSecondsLeft(WORK_DURATION);
      setIsRunning(true);
      setIsPaused(false);
    });
  }, []);

  const startBreak = useCallback(() => {
    setTimerFinished(false);
    setJustSwitchedWork(false);
    setJustSwitchedBreak(false);
    setDuration(BREAK_DURATION);
    setSecondsLeft(BREAK_DURATION);
    setIsBreak(true);
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => setIsPaused(true), []);
  const continueTimer = useCallback(() => setIsPaused(false), []);
  const endTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setSecondsLeft(duration);
  }, [duration]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Timer Circle */}
      <div className="relative w-120 h-130">
        <svg className="transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#e5e7eb"
            strokeWidth="1"
            fill="none"
          />
          {/* Break circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#4ade80"
            strokeWidth="1"
            fill="none"
            strokeDasharray={FULL_DASH_ARRAY}
            strokeDashoffset={FULL_DASH_ARRAY * (1 - breakProgress)}
            strokeLinecap="round"
            style={{
              transition: getTransitionStyle(justSwitchedBreak),
              opacity: getOpacity(isBreak && isRunning),
            }}
          />
          {/* Work circle */}
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
            style={{
              transition: getTransitionStyle(justSwitchedWork),
              opacity: getOpacity(!isBreak && isRunning),
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-7xl font-semibold text-gray-800 h-[65px]">
            {formatTime(secondsLeft)}
          </div>
          <div className="mt-2 h-[10px] text-sm font-bold tracking-wide text-[var(--color-accent)]">
            {!isRunning && !isPaused && (isBreak ? "you can relax now :)" : "")}
            {isPaused && "Paused"}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center gap-4 mt-10 h-[120px]">
        {!isRunning && !isPaused && (
          <button
            onClick={isBreak ? startBreak : startWork} // reversed logic as before
            className="text-white bg-[var(--color-accent)] hover:bg-[color:var(--color-accent-hover,#1e90ff)] rounded-full text-xl w-[180px] h-[50px] transition duration-200"
          >
            {isBreak ? "Relax" : "Work"}
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
              className="text-white bg-[var(--color-accent)] hover:bg-transparent hover:text-[var(--color-accent)] hover:border-2 rounded-full border-[var(--color-accent)] text-xl w-[180px] h-[50px] transition duration-200"
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
