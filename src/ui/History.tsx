import React, { useEffect, useState } from "react";
import { getSessions } from "./storage";
import type { FocusSession } from "./types";

const History: React.FC = () => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  useEffect(() => {
    const data = getSessions();
    setSessions(data.reverse()); // Show latest first
  }, []);

  return (
    <div>
      <h2>Session History</h2>
      {sessions.length === 0 ? (
        <p>No sessions yet</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <strong>{session.label}</strong> |{" "}
              {new Date(session.startTime).toLocaleTimeString()} -{" "}
              {new Date(session.endTime).toLocaleTimeString()} | Duration:{" "}
              {(session.duration / 60000).toFixed(1)} min |{" "}
              {session.interrupted ? "Interrupted" : "Completed"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
