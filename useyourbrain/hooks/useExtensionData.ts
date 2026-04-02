import { useState, useEffect } from 'react';

const EXTENSION_ID = "hfleomfalfkdcgopbihklbhlhijkolpc";

// 1. Define getChrome at the top so all functions can see it
const getChrome = () => typeof window !== "undefined" ? (window as any).chrome : null;

export function useExtensionData() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(true);
  const [status, setStatus] = useState("LOADING");

  // 2. Define clearLog as its own function
  const clearLog = () => {
    const chromeAPI = getChrome();
    setPrompts([]);

    // Tell extension to wipe storage
    if (chromeAPI && chromeAPI.runtime) {
      chromeAPI.runtime.sendMessage(
        EXTENSION_ID, 
        { action: "clearHistory" },
        (response: any) => {
          if (chromeAPI.runtime.lastError) {
            console.error("Clear failed:", chromeAPI.runtime.lastError);
          }
        }
      );
    }
  };

  const fetchData = () => {
    const chromeAPI = getChrome();

    if (chromeAPI && chromeAPI.runtime) {
      chromeAPI.runtime.sendMessage(
        EXTENSION_ID, 
        { action: "getHistory" }, 
        (res: any) => {
          if (chromeAPI.runtime.lastError) {
            setStatus("EXTENSION NOT FOUND");
            return;
          }

          if (res) {
            setPrompts(res.history || []);
            setIsRecording(res.isRecording !== false);
            setStatus("CONNECTED");
          }
        }
      );
    } else {
      setStatus("BROWSER NOT SUPPORTED");
    }
  };

  // 3. Logic to sync recording state back to extension
  const syncRecordingState = (newState: boolean) => {
    const chromeAPI = getChrome();
    setIsRecording(newState);

    if (chromeAPI && chromeAPI.runtime) {
      chromeAPI.runtime.sendMessage(
        EXTENSION_ID, 
        { action: "updateSettings", isRecording: newState },
        () => {
          if (chromeAPI.runtime.lastError) {
            console.error("Sync failed:", chromeAPI.runtime.lastError);
          }
        }
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Return all 6 items needed by page.tsx
  return { 
    prompts, 
    setPrompts: clearLog,
    status, 
    fetchData, 
    isRecording, 
    setIsRecording: syncRecordingState 
  };
}