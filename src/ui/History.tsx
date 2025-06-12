import React, { useEffect, useState } from "react";
import { getSessions } from "./storage";
import type { FocusSession } from "./types";
import { GiTomato } from "react-icons/gi";

interface Props {
  sessionUpdated: boolean;
  onHandled: () => void;
}

// Format time like "9:15 AM"
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Label by time of day
const getTimeOfDayLabel = (date: Date) => {
  const hour = date.getHours();
  if (hour >= 4 && hour < 8) return "Early Morning";
  if (hour >= 8 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  return "Evening";
};

const History: React.FC<Props> = ({ sessionUpdated, onHandled }) => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  const loadSessions = () => {
    const data = getSessions();

    const uniqueSessions = Array.from(
      new Map(data.map((s) => [s.id, s])).values()
    );

    const validSessions = uniqueSessions
      .filter(
        (s) =>
          !isNaN(new Date(s.startTime).getTime()) &&
          !isNaN(new Date(s.endTime).getTime())
      )
      .reverse();

    setSessions(validSessions);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (sessionUpdated) {
      loadSessions();
      onHandled();
    }
  }, [sessionUpdated]);

  // Group by time of day
  const groupedByTimeOfDay = sessions.reduce<Record<string, FocusSession[]>>(
    (groups, session) => {
      const label = getTimeOfDayLabel(new Date(session.startTime));
      if (!groups[label]) groups[label] = [];
      groups[label].push(session);
      return groups;
    },
    {}
  );

  const timeOrder = ["Early Morning", "Morning", "Afternoon", "Evening"];

  return (
    <div className="self-start w-full max-w-md px-6">
      <h2 className="text-xl font-bold mb-2">Session History</h2>
      {sessions.length === 0 ? (
        <p>No sessions yet</p>
      ) : (
        timeOrder.map((label) => {
          const sessionsInLabel = groupedByTimeOfDay[label];
          if (!sessionsInLabel || sessionsInLabel.length === 0) return null;

          return (
            <div key={label} className="mb-4">
              <h3 className="text-md font-semibold">{label}</h3>
              <ul className="list-none space-y-2">
                {sessionsInLabel.map((session) => (
                  <li
                    key={session.id}
                    className="flex justify-between items-center text-[var(--color-accent)]"
                  >
                    <div className="flex items-center gap-2">
                      <GiTomato className="w-5 h-5 text-[var(--color-accent)]" />
                      <span>
                        {formatTime(session.startTime)} –{" "}
                        {formatTime(session.endTime)}
                      </span>
                    </div>
                    <span className="min-w-[60px] text-right">
                      {(session.duration / 60000).toFixed(1)} min
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
};

export default History;
