"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(e.target.value));
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] select-none">
      {/* Background Checkered Pattern for transparency (Visible under the "After" state) */}
      <div className="absolute inset-0 bg-white" style={{
        backgroundImage: "radial-gradient(#e4e4e7 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }} />

      {/* BEFORE STATE (Left/Underneath: Image with Background) */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center p-8 sm:p-12 z-0">
        <div className="relative w-full h-full max-w-md flex flex-col justify-center items-center">
          {/* Mock background scene to be removed */}
          <div className="absolute inset-0 w-full h-full bg-zinc-100 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-200">
            {/* Abstract background blobs & shapes */}
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-zinc-200/80 filter blur-xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-zinc-300/60 filter blur-xl" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-zinc-200/50 filter blur-md" />
            
            {/* Grid structure showing background depth */}
            <div className="w-full h-full opacity-10 flex flex-wrap gap-2 p-4">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="w-8 h-8 border border-zinc-400" />
              ))}
            </div>
          </div>

          {/* Main Object: A premium camera vector (in Before State, it is here with background) */}
          <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 text-zinc-800 drop-shadow-md">
            <CameraSvg isBefore={true} />
          </div>
        </div>
      </div>

      {/* AFTER STATE (Right/On Top: background removed, transparent checkered mesh) */}
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center p-8 sm:p-12 z-10 pointer-events-none overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <div className="relative w-full h-full max-w-md flex flex-col justify-center items-center">
          {/* Transparency grid (After state background) */}
          <div className="absolute inset-0 w-full h-full rounded-xl border border-zinc-200 bg-white overflow-hidden" style={{
            backgroundImage: "conic-gradient(#f4f4f5 0.25turn, transparent 0.25turn 0.5turn, #f4f4f5 0.5turn 0.75turn, transparent 0.75turn)",
            backgroundSize: "20px 20px"
          }}>
            {/* Floating AI detection coordinates/bounding box */}
            <div className="absolute inset-4 border border-dashed border-zinc-300 rounded-lg opacity-40">
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-zinc-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-zinc-600" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-zinc-600" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-zinc-600" />
              <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-zinc-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                <Sparkles className="size-2.5" />
                BACKGROUND REMOVED
              </div>
            </div>
          </div>

          {/* Main Object: The same camera vector but cleaner, without shadow, highlighting its isolated edge */}
          <div className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 text-zinc-900">
            <CameraSvg isBefore={false} />
          </div>
        </div>
      </div>

      {/* SLIDER CONTROLLER & LABELS */}
      {/* Slider labels */}
      <div className="absolute bottom-4 left-4 z-20 bg-zinc-900/95 text-white text-[10px] tracking-widest font-mono uppercase px-2.5 py-1 rounded-sm shadow-xs border border-zinc-800">
        Antes
      </div>
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 text-zinc-900 text-[10px] tracking-widest font-mono uppercase px-2.5 py-1 rounded-sm shadow-xs border border-zinc-200">
        Depois (IA)
      </div>

      {/* Divider line & handle */}
      <div 
        className="absolute top-0 bottom-0 w-[1px] bg-zinc-400/80 z-20 pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-zinc-300 bg-white shadow-md flex items-center justify-center gap-1 select-none pointer-events-none">
          <div className="w-[1px] h-3 bg-zinc-400" />
          <div className="w-[1px] h-3 bg-zinc-400" />
        </div>
      </div>

      {/* Range Input Layer on top to capture all gestures */}
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 touch-none"
        aria-label="Controle de visualização de antes e depois"
      />
    </div>
  );
}

// Camera SVG Vector Illustration
function CameraSvg({ isBefore }: { isBefore: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      {/* Camera Outer Body */}
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" fill={isBefore ? "#f4f4f5" : "#ffffff"} />
      
      {/* Camera Lens Outer Ring */}
      <circle cx="12" cy="13" r="5" fill={isBefore ? "#e4e4e7" : "#fafafa"} />
      
      {/* Lens Inner Glass */}
      <circle cx="12" cy="13" r="3" fill="#09090b" />
      
      {/* Lens reflection (Only on After state to show extra detail/upscale effect) */}
      {!isBefore && (
        <path d="M11.5 11.5a1.5 1.5 0 0 1 1 1" stroke="#ffffff" strokeWidth="1" />
      )}

      {/* Camera Details */}
      <circle cx="19" cy="9.5" r="0.5" fill="currentColor" />
      <rect x="5" y="9.5" width="2" height="1" rx="0.2" fill="currentColor" />

      {/* Aesthetic crosshairs on the isolated camera to symbolize AI precision */}
      {!isBefore && (
        <>
          <line x1="12" y1="2.5" x2="12" y2="4.5" stroke="#71717a" strokeWidth="1" strokeDasharray="1 1" />
          <line x1="12" y1="21.5" x2="12" y2="23.5" stroke="#71717a" strokeWidth="1" strokeDasharray="1 1" />
          <line x1="2.5" y1="13" x2="4.5" y2="13" stroke="#71717a" strokeWidth="1" strokeDasharray="1 1" />
          <line x1="21.5" y1="13" x2="23.5" y2="13" stroke="#71717a" strokeWidth="1" strokeDasharray="1 1" />
        </>
      )}
    </svg>
  );
}
