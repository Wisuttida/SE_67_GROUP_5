"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 👉 กำหนด Type ของ Context
type ToastContextType = {
  toast: (msg: string) => void;
};

// 👉 สร้าง Context พร้อมค่าเริ่มต้น
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const toast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white p-2 rounded shadow-lg">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
