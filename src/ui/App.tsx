import React from "react";
import Timer from "./Timer";
import Overview from "./Overview";
import History from "./History";
import DailyMessage from "./DailyMessage";

function App() {
  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="flex flex-1 items-center justify-center">
        <DailyMessage />
        <Timer />
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center">
        <Overview />
        <History />
      </div>
    </div>
  );
}

export default App;
