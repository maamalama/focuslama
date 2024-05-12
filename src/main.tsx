import React, { useState } from "react";
import { Button } from "./components/ui/button";
import {
  CalendarIcon,
  ChevronDownIcon,
  MoonIcon,
  BarChartIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

const Main = () => {
  const [sessionOpen, setSessionOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);

  const openStatistics = () => {
    // Ensure this code runs only within a Chrome Extension environment
    if (chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL("statistics.html") });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <Button variant="outline">
        <CalendarIcon className="mr-2 h-5 w-5" />
        Session
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Today</DropdownMenuItem>
            <DropdownMenuItem>This Week</DropdownMenuItem>
            <DropdownMenuItem>This Month</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Button>
      <Button variant="outline">
        <MoonIcon className="mr-2 h-5 w-5" />
        Mode
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Light</DropdownMenuItem>
            <DropdownMenuItem>Dark</DropdownMenuItem>
            <DropdownMenuItem>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Button>
      <Button variant="outline" onClick={openStatistics}>
        <BarChartIcon className="mr-2 h-5 w-5" />
        Statistics
      </Button>
    </div>
  );
};

export default Main;
