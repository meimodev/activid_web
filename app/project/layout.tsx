import type { Metadata } from "next";
import localFont from "next/font/local";
import "./projects.css";

const outfit = localFont({
  src: [
    { path: "../../public/fonts/outfit/outfit-regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/outfit/outfit-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-projects",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project workspace | ACTIVID",
  description: "Your ACTIVID client workspace. Follow progress, upcoming milestones, and the next steps for your creative projects.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`projects-root ${outfit.variable}`}>{children}</div>;
}
