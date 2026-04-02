'use client';

import React from "react";
import { useExtensionData } from '@/hooks/useExtensionData';
import EndOfSessionModal from '@/components/EndOfSessionModal'
import CustomEmail from "@/components/CustomEmail";

export default function Home() {
  const { 
    prompts, 
    setPrompts, // This now triggers the clearHistory message
    status, 
    fetchData, 
    isRecording, 
    setIsRecording // This now triggers the updateSettings message
  } = useExtensionData();

  const handleToggleRecording = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.checked;
    setIsRecording(newState);
  };

  return (
    <div className="min-h-screen bg-paper p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section: High Contrast Serif */}
        <header className="mb-12 border-b-2 border-ink pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter italic text-ink">
              PromptLogger
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <span className={`w-3 h-3 border border-ink ${
                status === "CONNECTED" ? "bg-ink animate-pulse" : "bg-transparent"
              }`} />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                System Status: {status}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={fetchData}
              className="px-4 py-2 border-2 border-ink font-bold text-xs uppercase tracking-widest hover:bg-card transition-colors cursor-pointer"
            >
              Sync Data
            </button>
            <button 
              onClick={() => setPrompts()}
              className="px-4 py-2 border-2 border-ink bg-ink text-paper font-bold text-xs uppercase tracking-widest cursor-pointer shadow-[4px_4px_0px_0px_var(--color-ink-shadow)]"
            >
              Clear Log
            </button>
          </div>
        </header>

        {/* Capture Control: "The Checklist Look" */}
        <div className="mb-12 p-6 border-2 border-ink bg-card shadow-[6px_6px_0px_0px_var(--color-ink-shadow)] flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-tight">Capture Status</h2>
            <p className="text-sm italic text-ink-muted leading-tight">
              {isRecording ? "Actively logging your logic for review." : "Logging is currently paused."}
            </p>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isRecording} 
              onChange={handleToggleRecording}
              className="sr-only peer" 
            />
            {/* Custom Square Toggle to match the aesthetic */}
            <div className="w-14 h-8 border-2 border-ink bg-paper peer-checked:bg-ink transition-colors relative">
              <div className={`absolute top-1 left-1 w-4 h-4 border-2 border-ink bg-paper transition-transform ${isRecording ? 'translate-x-6 bg-paper' : ''}`}></div>
            </div>
          </label>
        </div>

        {/* Main Feed: The "Ledger" Look */}
        <main className="space-y-8">
          {prompts.length > 0 ? (
            prompts.map((p: any, i: number) => (
              <div key={i} className="border-2 border-ink p-8 bg-card relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-ink text-paper text-[10px] font-bold uppercase tracking-widest">
                  {p.site || "Gemini"}
                </div>
                <p className="text-xl italic text-ink leading-relaxed mb-4">
                  "{p.prompt}"
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-ink/10">
                  <span className="text-[10px] font-bold uppercase text-ink-muted">Logged at: {p.time}</span>
                  <span className="text-xs font-bold italic opacity-40">#00{i + 1}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center border-2 border-ink border-dashed bg-card/30">
              <p className="text-ink-muted italic text-lg">
                Your intellectual ledger is currently empty.
              </p>
            </div>
          )}
        </main>

        {/* Footer: Thesis Branding */}
      </div>
      <EndOfSessionModal></EndOfSessionModal>
      <CustomEmail></CustomEmail>
    </div>
  );
}