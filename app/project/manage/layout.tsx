import Link from "next/link";
import { Asterisk } from "lucide-react";
import { isProjectAdmin } from "@/lib/project-admin-session";
import { getAdminPassword } from "@/lib/admin-password";
import { getSessionSecret } from "@/lib/session-secret";
import ProjectLogin from "../login";
import { logoutProjectAdmin } from "../actions";
import "./manage.css";

export default async function ManagementLayout({ children }: { children: React.ReactNode }) {
  if (!(await isProjectAdmin())) return <ProjectLogin configured={Boolean(getAdminPassword() && getSessionSecret())} />;
  return <div className="project-management">
    <a className="projects-skip" href="#management-content">Skip to management</a>
    <header className="manager-header"><div className="manager-header-inner">
      <Link className="activid-wordmark" href="/project" aria-label="ACTIVID workspace">activid<Asterisk className="brand-asterisk" strokeWidth={3.5} aria-hidden="true" /></Link>
      <span className="manager-scope">Project management<span>ACTIVID team only</span></span>
      <nav aria-label="Project management"><Link href="/project">Overview</Link><form action={logoutProjectAdmin}><button>Sign out</button></form></nav>
    </div></header>
    <main id="management-content" className="manager-main">{children}</main>
  </div>;
}
