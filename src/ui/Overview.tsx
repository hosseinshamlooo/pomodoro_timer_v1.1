import React, { useState, useEffect } from "react";
import { getSessions } from "./storage";
import type { FocusSession } from "./types";

interface Props {
  sessionUpdated: boolean;
  onHandled: () => void;
}

const Overview: React.FC<Props> = ({ sessionUpdated, onHandled }) => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  useEffect(() => {
    const data = getSessions();
    setSessions(data);
  }, []);

  useEffect(() => {
    if (sessionUpdated) {
      const updated = getSessions();
      setSessions(updated);
      onHandled();
    }
  }, [sessionUpdated, onHandled]);

  const isToday = (dateStr: number) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const todaysSessions = sessions.filter((s) => isToday(s.endTime));
  const todaysFocusMinutes = todaysSessions.reduce(
    (acc, s) => acc + Math.round(s.duration / 60000),
    0
  );

  return (
    <div className="h-45">
      <h1 className="text-2xl font-semibold mb-4">Overview</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Box title="Today's Pomos" value={todaysSessions.length} />
        <Box title="Total Duration" value={`${todaysFocusMinutes} mins`} />
      </div>
    </div>
  );
};

interface BoxProps {
  title: string;
  value: number | string;
}

const Box: React.FC<BoxProps> = ({ title, value }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--color-primary, #f0f0f0)",
        borderRadius: "8px",
        padding: "1rem",
        textAlign: "left", // ✅ changed from "center" to "left"
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
    </div>
  );
};

export default Overview;
