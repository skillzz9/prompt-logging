'use client'; // Required to use hooks and access the 'window' object

import { useEffect, useState } from "react";
import Image from "next/image";

// extension that records the prompts
const EXTENSION_ID = "hfleomfalfkdcgopbihklbhlhijkolpc";

declare global {
  interface Window {
    chrome: any;
  }
}

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState("DISCONNECTED");
  const [prompts, setPrompts] = useState([]);

useEffect(() => {
  const chromeAPI = typeof window !== "undefined" ? (window as any).chrome : null;

  if (chromeAPI && chromeAPI.runtime) {
    console.log("Attempting to connect to extension:", EXTENSION_ID);

    chromeAPI.runtime.sendMessage(
      EXTENSION_ID,
      { action: "getHistory" },
      (response: any) => {
        // CHECK THE ERROR HERE
        if (chromeAPI.runtime.lastError) {
          const errorMsg = chromeAPI.runtime.lastError.message;
          console.error("CHROME EXTENSION ERROR:", errorMsg);
          
          setConnectionStatus(`ERROR: ${errorMsg}`);
          return;
        }

        if (response && response.history) {
          console.log("Data received successfully!");
          setConnectionStatus("CONNECTED");
          setPrompts(response.history);
        } else {
          console.warn("Received empty or invalid response:", response);
          setConnectionStatus("EMPTY RESPONSE");
        }
      }
    );
  } else {
    console.warn("Chrome API not found. Are you in a Chromium browser?");
    setConnectionStatus("CHROME API MISSING");
  }
}, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mt-10">
          {/* Connection Badge */}
          <div className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest ${
            connectionStatus === "CONNECTED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {connectionStatus}
          </div>

          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {connectionStatus === "CONNECTED" 
              ? `Displaying ${prompts.length} Prompts` 
              : "Connecting to Extension..."}
          </h1>
          
          <div className="w-full space-y-4 mt-4">
            {prompts.map((item: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-400 mb-1">{item.site} • {item.time}</p>
                <p className="text-sm text-zinc-800 dark:text-zinc-200">{item.prompt}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-10">
          <button
            onClick={() => window.location.reload()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          >
            Refresh Data
          </button>
        </div>
      </main>
    </div>
  );
}