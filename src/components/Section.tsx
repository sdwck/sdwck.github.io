import React from "react";

export function Section({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: React.ComponentType<any>; }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="opacity-70" /> : null}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}