import type { ReactNode } from "react";

// Re-mounts on every navigation within the (kenangan) group, so the CSS enter
// animation replays on each route change (Console -> event detail, login ->
// Console, guest capture/feed/gallery). Motion conveys "new screen"; reduced
// motion is honored by the .kk-root rule in kenangan.css.
export default function KenanganTemplate({ children }: { children: ReactNode }) {
  return <div className="kk-route-enter">{children}</div>;
}
