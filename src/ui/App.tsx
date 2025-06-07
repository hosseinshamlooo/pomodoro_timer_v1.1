import React from "react";
import Timer from "./Timer";
import Overview from "./Overview";
import History from "./History";
import DailyMessage from "./DailyMessage";

function App() {
  return (
    <div className="flex mt-10">
      {/* Left Side */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <DailyMessage />
        <Timer />
      </div>

      {/* Right Side */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <Overview />
        <History />
      </div>
    </div>
  );
}

export default App;
