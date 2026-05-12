"use client";

import { motion } from "framer-motion";

export function Toast({ message }: { message: string }) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ y: 20, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      exit={{ y: 20, opacity: 0, x: "-50%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-7 left-1/2 z-[1100] inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm text-white bg-khi-ink/90 border border-khi-blue/55"
      style={{
        boxShadow: "0 14px 40px rgba(0,0,0,0.4), 0 0 26px rgba(49,107,255,0.32)",
      }}
    >
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-khi-blue-bright" style={{ boxShadow: "0 0 12px #4579FF" }} />
      {message}
    </motion.div>
  );
}
