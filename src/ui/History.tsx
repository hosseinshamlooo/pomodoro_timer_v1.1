import React, { useEffect, useState } from "react";
import { getSessions, clearSessions } from "./storage"; // ✅ Add `clearSessions`
import type { FocusSession } from "./types";

const formatTime = (value: string | number): string => {
  const date = new Date(value);
  return isNaN(date.getTime())
    ? "Invalid Time"
    : date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const getTimeOfDayLabel = (value: string | number): string => {
  const date = new Date(value);
  const hour = date.getHours();

  if (hour >= 0 && hour < 6) return "Early Morning";
  if (hour >= 6 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 18) return "Afternoon";
  return "Evening";
};

const History: React.FC = () => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  const loadSessions = () => {
    const data = getSessions();

    const uniqueSessions = Array.from(
      new Map(data.map((s) => [s.id, s])).values()
    );

    const validSessions = uniqueSessions
      .filter(
        (s: FocusSession) =>
          !isNaN(new Date(s.startTime).getTime()) &&
          !isNaN(new Date(s.endTime).getTime())
      )
      .reverse();

    setSessions(validSessions);
  };

  useEffect(() => {
    loadSessions();

    const handleUpdate = () => {
      loadSessions();
    };

    window.addEventListener("sessionsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("sessionsUpdated", handleUpdate);
    };
  }, []);

  // ✅ Midnight reset logic
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        clearSessions(); // ✅ Clear sessions from storage
        setSessions([]); // ✅ Clear sessions from UI
      }
    };

    const intervalId = setInterval(checkMidnight, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  const groupedByTimeOfDay = sessions.reduce((acc, session) => {
    const label = getTimeOfDayLabel(session.startTime);
    if (!acc[label]) acc[label] = [];
    acc[label].push(session);
    return acc;
  }, {} as Record<string, FocusSession[]>);

  const timeOfDayOrder = ["Early Morning", "Morning", "Afternoon", "Evening"];

  return (
    <div className="self-start w-full max-w-md px-6">
      <h2 className="text-lg font-bold mb-2">Session History</h2>
      {sessions.length === 0 ? (
        <p>No sessions yet</p>
      ) : (
        timeOfDayOrder.map((label) =>
          groupedByTimeOfDay[label] ? (
            <div key={label} className="mb-4">
              <h3 className="text-md font-semibold">{label}</h3>
              <ul className="list-disc list-inside">
                {groupedByTimeOfDay[label].map((session) => (
                  <li key={session.id}>
                    🍅 {formatTime(session.startTime)} -{" "}
                    {formatTime(session.endTime)} |{" "}
                    {(session.duration / 60000).toFixed(1)} min
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )
      )}
    </div>
  );
};

export default History;
