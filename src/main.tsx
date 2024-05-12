import React, { useState } from "react";

const Main = () => {
  const [sessionOpen, setSessionOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 w-48">
      {/* Session Button */}
      <button
        onClick={() => setSessionOpen(!sessionOpen)}
        className="flex text-center justify-center w-full items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
      >
        <i className="fas fa-user-clock"></i>
        <span>Session</span>
      </button>
      {sessionOpen && (
        <select className="block w-full mt-1 bg-white border-gray-300 rounded shadow">
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
      )}

      {/* Mode Button */}
      <button
        onClick={() => setModeOpen(!modeOpen)}
        className="flex text-center justify-center w-full items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-green-700 transition-colors duration-300"
      >
        <i className="fas fa-cogs"></i>
        <span>Mode</span>
      </button>
      {modeOpen && (
        <select className="block w-full mt-1 bg-white border-gray-300 rounded shadow">
          <option>Mode 1</option>
          <option>Mode 2</option>
        </select>
      )}

      {/* Statistics Button */}
      <button className="flex text-center justify-center w-full items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-red-700 transition-colors duration-300">
        <i className="fas fa-chart-bar"></i>
        <span>Statistics</span>
      </button>
    </div>
  );
};

export default Main;
