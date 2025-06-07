import React, { useEffect, useState } from "react";

// Replace with your name or pass it as a prop
const USER_NAME = "Hossein";

const messages = [
  `Lock in, ${USER_NAME}. You’ve got this.`,
  `Let’s build something great today, ${USER_NAME}.`,
  `Breathe deep. Focus up, ${USER_NAME}.`,
  `You’re ready, ${USER_NAME}. Let’s go.`,
  `One step at a time, ${USER_NAME}.`,
  `Kind heart. Sharp focus, ${USER_NAME}.`,
  `Show up with love, ${USER_NAME}.`,
  `Peaceful mind. Purposeful action, ${USER_NAME}.`,
  `You’re growing, ${USER_NAME}. Stay with it.`,
  `The world needs your gift, ${USER_NAME}.`,
  `Shine quiet and steady, ${USER_NAME}.`,
  `Work with heart, ${USER_NAME}.`,
  `Stay soft. Stay strong, ${USER_NAME}.`,
  `Keep moving forward, ${USER_NAME}.`,
  `Be proud of today, ${USER_NAME}.`,
  `Grace and grit, ${USER_NAME}.`,
  `Rooted. Ready. Rising, ${USER_NAME}.`,
  `Your pace. Your path, ${USER_NAME}.`,
  `Let it be meaningful, ${USER_NAME}.`,
  `Lock in gently, ${USER_NAME}.`,
  `Do it with care, ${USER_NAME}.`,
  `You’re becoming, ${USER_NAME}.`,
  `Soft focus. Strong spirit, ${USER_NAME}.`,
  `This is your chapter, ${USER_NAME}.`,
  `Eyes up. Heart open, ${USER_NAME}.`,
  `You’ve come far, ${USER_NAME}.`,
  `Keep showing up, ${USER_NAME}.`,
  `Quiet power, ${USER_NAME}.`,
  `Build the life, ${USER_NAME}.`,
  `It starts now, ${USER_NAME}.`,
];

const DailyMessage: React.FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMessage(messages[randomIndex]);
  }, []);

  return (
    <div className="text-center text-4xl font-bold text-gray-800">
      {message}
    </div>
  );
};

export default DailyMessage;
