/** Curated Lucide icon set used across the LOIT page. */
export {
  Users,
  ScanLine,
  WifiOff,
  Church,
  ClipboardList,
  Home,
  Sparkles,
  ArrowDown,
  Check,
  Receipt,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import {
  Users,
  ScanLine,
  WifiOff,
  Church,
  ClipboardList,
  Home,
  Sparkles,
} from "lucide-react";

/** Maps the string keys used in data.ts to icon components. */
export const ICONS: Record<string, LucideIcon> = {
  users: Users,
  scan: ScanLine,
  wifiOff: WifiOff,
  church: Church,
  clipboard: ClipboardList,
  home: Home,
  sparkles: Sparkles,
};
