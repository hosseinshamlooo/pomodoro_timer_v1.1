import React from "react";
import Timer from "./Timer";
import Overview from "./Overview";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <Timer />
      <Overview />
    </div>
  );
}

export default App;
