import React, { useState } from "react";

interface Pomodoro {
  duration: number; // in minutes
  completedAt: Date;
}

const Overview = () => {
  const [pomodoros, setPomodoros] = useState<Pomodoro[]>([]);

  const addPomodoro = (duration: number) => {
    const newPomodoro: Pomodoro = {
      duration,
      completedAt: new Date(),
    };
    setPomodoros((prev) => [...prev, newPomodoro]);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const todaysPomos = pomodoros.filter((p) => isToday(p.completedAt));
  const todaysFocus = todaysPomos.reduce((acc, p) => acc + p.duration, 0);
  const totalPomos = pomodoros.length;
  const totalFocus = pomodoros.reduce((acc, p) => acc + p.duration, 0);

  return (
    <div className="h-full">
      <h1 className="text-2xl font-semi-bold">Overview</h1>
      {/* 2x2 Box Grid */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Box title="Today's Pomos" value={todaysPomos.length} />
        <Box title="Today's Focus Duration" value={todaysFocus} />
        <Box title="Total Pomos" value={totalPomos} />
        <Box title="Total Focus Duration" value={totalFocus} />
      </div>

      {/* Simulate adding a pomodoro */}
      <button onClick={() => addPomodoro(25)}>Save 25-min Pomodoro</button>
    </div>
  );
};

interface BoxProps {
  title: string;
  value: number;
}

const Box: React.FC<BoxProps> = ({ title, value }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--color-primary)",
        borderRadius: "8px",
        padding: "1rem",
        textAlign: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
    </div>
  );
};
export default Overview;
