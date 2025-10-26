import React from "react";

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 backdrop-blur border border-white/10">
      {children}
    </span>
  );
}
