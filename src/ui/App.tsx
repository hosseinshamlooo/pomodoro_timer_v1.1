import { useState } from "react";
import Timer from "./Timer";
import Overview from "./Overview";
import History from "./History";
import DailyMessage from "./DailyMessage";

function App() {
  const [sessionUpdated, setSessionUpdated] = useState(false);

  return (
    <div className="flex mt-10">
      {/* Left Side */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <DailyMessage />
        <Timer onSessionEnd={() => setSessionUpdated(true)} />
      </div>

      {/* Right Side */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <Overview
          sessionUpdated={sessionUpdated}
          onHandled={() => setSessionUpdated(false)}
        />
        <History
          sessionUpdated={sessionUpdated}
          onHandled={() => setSessionUpdated(false)}
        />
      </div>
    </div>
  );
}

export default App;
