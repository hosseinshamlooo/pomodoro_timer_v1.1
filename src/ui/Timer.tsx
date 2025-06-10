import React, { useEffect, useState, useCallback, useRef } from "react";
import { saveSession } from "./storage.ts";
import type { FocusSession } from "./types.ts";
import bellSound from "./bicyclebellsound.wav"; // adjust the filename if needed

const FULL_DASH_ARRAY = 283;
const WORK_DURATION = 60;
const BREAK_DURATION = 3;

interface TimerProps {
  onSessionEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ onSessionEnd }) => {
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [duration, setDuration] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreak, setIsBreak] = useState(true);
  const [timerFinished, setTimerFinished] = useState(false);
  const [justSwitchedWork, setJustSwitchedWork] = useState(false);
  const [justSwitchedBreak, setJustSwitchedBreak] = useState(false);

  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const progress =
    isRunning || timerFinished
      ? Math.min(1, Math.round((1 - secondsLeft / duration) * 1000) / 1000)
      : 0;

  const breakProgress = isRunning && isBreak ? 1 - secondsLeft / duration : 0;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(bellSound);
    audioRef.current.volume = 1.0;
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      // Ref flag to prevent duplicate runs inside the same tick
      let timerEnded = false;

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (!timerEnded) {
              timerEnded = true;
              clearInterval(intervalRef.current!);
              intervalRef.current = null;

              setTimerFinished(true);
              audioRef.current
                ?.play()
                .catch((err) => console.error("Audio play failed:", err));

              if (sessionStartTime !== null && !isBreak) {
                const endTime = Date.now();
                const session: FocusSession = {
                  id: crypto.randomUUID(),
                  startTime: sessionStartTime,
                  endTime,
                  duration: endTime - sessionStartTime,
                  label: "Work Session",
                  interrupted: false,
                };
                saveSession(session);
                setSessionStartTime(null);

                onSessionEnd();
              }

              setTimeout(() => {
                const nextIsBreak = !isBreak;
                const nextDuration = nextIsBreak
                  ? BREAK_DURATION
                  : WORK_DURATION;

                setIsBreak(nextIsBreak);
                setDuration(nextDuration);
                setSecondsLeft(nextDuration);
                setIsRunning(false);
                setTimerFinished(false);

                if (nextIsBreak) {
                  setJustSwitchedBreak(true);
                  setJustSwitchedWork(false);
                } else {
                  setJustSwitchedWork(true);
                  setJustSwitchedBreak(false);
                }
              }, 1000);
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, isBreak, sessionStartTime]);

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

  const getTransitionStyle = (justSwitched: boolean) =>
    justSwitched ? "none" : "stroke-dashoffset 1s linear";

  const getOpacity = (active: boolean) => (active ? 1 : 0);

  const startWork = useCallback(() => {
    const now = Date.now();
    setSessionStartTime(now);

    const newDuration = WORK_DURATION;
    setJustSwitchedWork(true);
    requestAnimationFrame(() => {
      setTimerFinished(false);
      setIsBreak(false);
      setDuration(newDuration);
      setSecondsLeft(newDuration);
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
    setSessionStartTime(null);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const continueTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  const endTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (sessionStartTime !== null && !isBreak) {
      const endTime = Date.now();
      const session: FocusSession = {
        id: crypto.randomUUID(),
        startTime: sessionStartTime,
        endTime,
        duration: endTime - sessionStartTime,
        label: "Work Session",
        interrupted: true,
      };
      saveSession(session);
    }

    setSessionStartTime(null);
    setSecondsLeft(duration);
  }, [duration, isBreak, sessionStartTime]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
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

      <div className="flex flex-col items-center gap-4 mt-10 h-[120px]">
        {!isRunning && !isPaused && (
          <button
            onClick={isBreak ? startBreak : startWork}
            className={`text-white rounded-full text-xl w-[180px] h-[50px] transition duration-200 ${
              isBreak
                ? "bg-[#4ade80] hover:bg-[#22c55e]"
                : "bg-[var(--color-accent)] hover:bg-[color:var(--color-accent-hover,#1e90ff)]"
            }`}
          >
            {isBreak ? "Relax" : "Work"}
          </button>
        )}

        {isRunning && !isPaused && (
          <button
            onClick={pauseTimer}
            className={`bg-transparent border-2 rounded-full text-xl w-[180px] h-[50px] transition duration-200 ${
              isBreak
                ? "border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-white"
                : "border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
            }`}
          >
            Pause
          </button>
        )}

        {isPaused && (
          <button
            onClick={continueTimer}
            className={`bg-transparent border-2 rounded-full text-xl w-[180px] h-[50px] transition duration-200 ${
              isBreak
                ? "border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-white"
                : "border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
            }`}
          >
            Continue
          </button>
        )}

        {(isRunning || isPaused) && (
          <button
            onClick={endTimer}
            className="text-red-500 mt-5 hover:underline"
          >
            End Timer
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
