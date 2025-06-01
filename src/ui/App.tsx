import React from "react";
import Timer from "./Timer";
import Overview from "./Overview";

function App() {
  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="flex flex-1 items-center justify-center bg-red-100">
        <Timer />
      </div>

      {/* Vertical Divider */}
      <div className="w-[1px] bg-gray-300 h-full" />

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center bg-red-200 mr-20">
        <Overview />
      </div>
    </div>
  );
}

export default App;
