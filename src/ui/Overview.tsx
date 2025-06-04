import React, { useState } from "react";

interface Pomodoro {
  start: Date;
  end: Date;
  duration: number; // in seconds
}

const Overview = () => {
  const [pomodoros, setPomodoros] = useState<Pomodoro[]>([
    // Example sessions:
    {
      start: new Date("2025-06-04T14:00:00"),
      end: new Date("2025-06-04T14:25:00"),
      duration: 25 * 60,
    },
    {
      start: new Date("2025-06-04T15:00:00"),
      end: new Date("2025-06-04T15:30:00"),
      duration: 30 * 60,
    },
    {
      start: new Date("2025-06-05T09:00:00"),
      end: new Date("2025-06-05T09:25:00"),
      duration: 25 * 60,
    },
  ]);

  // Group pomodoros by day string like "June 4th"
  const groupByDay = (sessions: Pomodoro[]) => {
    const groups: { [day: string]: Pomodoro[] } = {};

    sessions.forEach((p) => {
      const day = formatDay(p.start);
      if (!groups[day]) groups[day] = [];
      groups[day].push(p);
    });
    return groups;
  };

  // Format "June 4th"
  const formatDay = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    // We want "4th", "1st", "2nd" etc:
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${date.toLocaleDateString("en-US", options)}${suffix}`;
  };

  // Format time as "HH:mm"
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format duration seconds to Xm Ys
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const groupedPomodoros = groupByDay(pomodoros);

  return (
    <div className="h-full">
      <h1 className="text-2xl font-semibold mb-4">Overview</h1>
      {/* 2x2 Box Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Box title="Total Pomos" value={pomodoros.length} />
        <Box
          title="Total Focus Duration (min)"
          value={Math.floor(
            pomodoros.reduce((acc, p) => acc + p.duration, 0) / 60
          )}
        />
        {/* You can add more boxes if you want */}
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">Focus History</h2>

        {Object.entries(groupedPomodoros).map(([day, sessions]) => (
          <div key={day} style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginBottom: "0.5rem",
              }}
            >
              {day}
            </div>

            {sessions.map((session, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.25rem",
                }}
              >
                <span role="img" aria-label="tomato">
                  🍅
                </span>
                <span>
                  {formatTime(session.start)} - {formatTime(session.end)} (
                  <em>{formatDuration(session.duration)}</em>)
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
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
