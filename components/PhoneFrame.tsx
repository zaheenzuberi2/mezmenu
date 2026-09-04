import type { ReactNode } from "react";

/** A premium device bezel used to frame the hero menu preview. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[290px] sm:w-[320px]">
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-accent/15 blur-3xl"
      />
      <div className="relative rounded-[2.75rem] bg-ink p-2.5 shadow-2xl shadow-black/30">
        <div
          aria-hidden
          className="absolute left-1/2 top-3.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink-2"
        />
        <div className="max-h-[600px] overflow-hidden rounded-[2.2rem] bg-bg">
          {children}
        </div>
      </div>
      {/* side buttons, purely decorative */}
      <div className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l bg-ink-2" />
      <div className="absolute -right-[3px] top-20 h-16 w-[3px] rounded-r bg-ink-2" />
    </div>
  );
}
