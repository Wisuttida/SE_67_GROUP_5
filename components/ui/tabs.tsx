"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="flex border-b">{children}</div>;
}

export function TabsTrigger({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium",
        active ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-black"
      )}
    >
      {label}
    </button>
  );
}

export function TabsContent({ children, active }: { children: React.ReactNode; active: boolean }) {
  return active ? <div className="p-4">{children}</div> : null;
}
