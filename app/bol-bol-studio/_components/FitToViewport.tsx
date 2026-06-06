import type { ReactNode } from "react";

// Mobile-first frame locked to the viewport height. The page fits vertically via
// normal flex layout (no transform scaling) — see
// docs/adr/0001-bol-bol-studio-fit-to-viewport-canvas.md
export default function FitToViewport({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100svh] w-screen justify-center overflow-hidden bg-[#1A3CB8]">
      <div className="h-[100svh] w-full max-w-[430px]">{children}</div>
    </div>
  );
}
