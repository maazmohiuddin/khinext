"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
}

const CONFIG: Record<ToastType, { icon: React.ElementType; dot: string; border: string; glow: string }> = {
  success: { icon: CheckCircle, dot: "#51FFD5", border: "rgba(81,255,213,0.45)", glow: "rgba(81,255,213,0.25)" },
  error:   { icon: XCircle,     dot: "#FF6B8E", border: "rgba(255,107,142,0.45)", glow: "rgba(255,107,142,0.25)" },
  info:    { icon: Info,        dot: "#4579FF", border: "rgba(49,107,255,0.55)",  glow: "rgba(49,107,255,0.32)"  },
};

export function Toast({ message, type = "info" }: ToastProps) {
  const { dot, border, glow } = CONFIG[type];
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ y: 24, opacity: 0, x: "-50%", scale: 0.92 }}
      animate={{ y: 0,  opacity: 1, x: "-50%", scale: 1    }}
      exit={{ y: 16,    opacity: 0, x: "-50%", scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-7 left-1/2 z-[1100] inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm text-white bg-khi-ink/95 backdrop-blur-xl"
      style={{
        border: `1px solid ${border}`,
        boxShadow: `0 14px 40px rgba(0,0,0,0.5), 0 0 28px ${glow}`,
      }}
    >
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot, boxShadow: `0 0 10px ${dot}` }} />
      {message}
    </motion.div>
  );
}
