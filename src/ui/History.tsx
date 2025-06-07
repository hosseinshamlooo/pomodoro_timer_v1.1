import React, { useEffect, useState } from "react";
import { getSessions } from "./storage";
import type { FocusSession } from "./types";

const formatDate = (value: string | number): string => {
  const date = new Date(value);
  return isNaN(date.getTime())
    ? "Invalid Date"
    : date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
};

const formatTime = (value: string | number): string => {
  const date = new Date(value);
  return isNaN(date.getTime())
    ? "Invalid Time"
    : date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const History: React.FC = () => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  useEffect(() => {
    const data = getSessions();
    const validSessions = data
      .filter(
        (s: FocusSession) =>
          !isNaN(new Date(s.startTime).getTime()) &&
          !isNaN(new Date(s.endTime).getTime())
      )
      .reverse(); // Show latest first
    setSessions(validSessions);
  }, []);

  const groupedSessions = sessions.reduce((acc, session) => {
    const day = formatDate(session.startTime);
    if (!acc[day]) acc[day] = [];
    acc[day].push(session);
    return acc;
  }, {} as Record<string, FocusSession[]>);

  return (
    <div className="self-start w-full max-w-md px-6">
      <h2 className="text-lg font-bold mb-2">Session History</h2>
      {sessions.length === 0 ? (
        <p>No sessions yet</p>
      ) : (
        Object.entries(groupedSessions).map(([date, daySessions]) => (
          <div key={date} className="mb-4">
            <h3 className="text-md font-semibold">{date}</h3>
            <ul className="list-disc list-inside">
              {daySessions.map((session) => (
                <li key={session.id}>
                  🍅 {formatTime(session.startTime)} -{" "}
                  {formatTime(session.endTime)} |{" "}
                  {(session.duration / 60000).toFixed(1)} min
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
