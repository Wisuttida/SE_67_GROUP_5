"use client";

import * as React from "react";

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className="border rounded px-2 py-1" {...props}>
      {children}
    </select>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}

export function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <div className="border rounded px-2 py-1">{children}</div>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div className="absolute bg-white border rounded shadow-lg">{children}</div>;
}

export function SelectValue({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}
