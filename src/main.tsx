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

  const containerStyle = {
    backgroundImage:
      "url('https://phhaadzdzbqylxtqzsms.supabase.co/storage/v1/object/public/resume/hack/llama_1.webp')", // Replace with your actual image URL
    backgroundSize: "cover", // Cover the entire container
    backgroundPosition: "center", // Center the background image
    backgroundRepeat: "no-repeat", // Do not repeat the image
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen gap-6 w-screen"
      style={containerStyle}
    >
      <Button variant="outline">
        <CalendarIcon className="mr-2 h-5 w-5" />
        Session
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Work</DropdownMenuItem>
            <DropdownMenuItem>Rest</DropdownMenuItem>
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
            <DropdownMenuItem>Message</DropdownMenuItem>
            <DropdownMenuItem>Angry Llama</DropdownMenuItem>
            <DropdownMenuItem>Start Over</DropdownMenuItem>
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
