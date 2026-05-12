import { Check } from "lucide-react";
import { ReactNode } from "react";

export function Success({
  title,
  children,
  idChip,
}: {
  title: ReactNode;
  children: ReactNode;
  idChip?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-[640px] rounded-3xl border border-khi-blue/30 bg-white/[0.04] p-10 md:p-12 text-center"
    >
      <div
        className="mx-auto mb-5 grid place-items-center w-16 h-16 rounded-full bg-khi-blue/15 border border-khi-blue/30 text-khi-blue-bright"
        style={{ boxShadow: "0 0 32px rgba(49,107,255,0.32)" }}
      >
        <Check size={28} strokeWidth={3} aria-hidden="true" />
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white -tracking-tight">
        {title}
      </h2>
      <div className="mt-3 text-white/70 leading-relaxed">{children}</div>
      {idChip && (
        <div className="mt-5">
          <div className="inline-block rounded-full bg-khi-blue/10 border border-khi-blue/30 px-4 py-1.5 font-mono text-xs text-khi-blue-soft tracking-wider">
            {idChip}
          </div>
        </div>
      )}
    </div>
  );
}
