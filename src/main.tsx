import { useState } from "react";

// export default function Main() {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-6">
//       <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           stroke-width="2"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           className="mr-2 h-5 w-5"
//         >
//           <path d="M8 2v4"></path>
//           <path d="M16 2v4"></path>
//           <rect width="18" height="18" x="3" y="4" rx="2"></rect>
//           <path d="M3 10h18"></path>
//         </svg>
//         Session
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           stroke-width="2"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           className="ml-2 h-4 w-4"
//           type="button"
//           id="radix-:r1g:"
//           aria-haspopup="menu"
//           aria-expanded="false"
//           data-state="closed"
//         >
//           <path d="m6 9 6 6 6-6"></path>
//         </svg>
//       </button>
//       <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           stroke-width="2"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           className="mr-2 h-5 w-5"
//         >
//           <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
//         </svg>
//         Mode
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           stroke-width="2"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           className="ml-2 h-4 w-4"
//           type="button"
//           id="radix-:r1i:"
//           aria-haspopup="menu"
//           aria-expanded="false"
//           data-state="closed"
//         >
//           <path d="m6 9 6 6 6-6"></path>
//         </svg>
//       </button>
//       <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           stroke-width="2"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           className="mr-2 h-5 w-5"
//         >
//           <line x1="12" x2="12" y1="20" y2="10"></line>
//           <line x1="18" x2="18" y1="20" y2="4"></line>
//           <line x1="6" x2="6" y1="20" y2="16"></line>
//         </svg>
//         Statistics
//       </button>
//     </div>
//   );
// }

const Main = () => {
  const [sessionOpen, setSessionOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);

  return (
    <div className="flex flex-col items-start p-4 space-y-2">
      {/* Session Button */}
      <button
        onClick={() => setSessionOpen(!sessionOpen)}
        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded"
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
        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded"
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
      <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded">
        <i className="fas fa-chart-bar"></i>
        <span>Statistics</span>
      </button>
    </div>
  );
};

export default Main;
