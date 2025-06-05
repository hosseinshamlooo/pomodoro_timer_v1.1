import React from "react";
import Timer from "./Timer";
import Overview from "./Overview";
import History from "./History";

function App() {
  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="flex flex-1 items-center justify-center">
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
