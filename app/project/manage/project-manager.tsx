"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plus, Search } from "lucide-react";
import { Status } from "../project-ui";
import { formatDate, progress, visibleProjects } from "../format";
import type { InternalProject } from "../types";
import { projectStatuses } from "./validation";

export function StorageNotice({ storage }: { storage: string }) {
  return storage === "firestore" ? null : <p className="manager-storage">{storage === "local" ? "Local workspace · Changes are saved on this machine. Configure Firebase Admin for shared storage on Vercel." : "Storage is not configured. Configure Firebase Admin to enable saving projects."}</p>;
}
export default function ProjectManager({ projects, storage }: { projects: InternalProject[]; storage: string }) {
  const [query, setQuery] = useState(""), [status, setStatus] = useState("All projects");
  const filtered = visibleProjects(projects, query, status, "updated");
  return <>
    <div className="manager-title"><div><h1>Manage projects</h1><p>Keep client progress and project history up to date.</p></div><Link className="manager-primary" href="/project/manage/new"><Plus size={17} />New project</Link></div>
    <StorageNotice storage={storage} />
    <div className="manager-controls"><label className="manager-search"><Search size={17} /><input type="search" aria-label="Search projects" placeholder="Search projects or clients" value={query} onChange={(e) => setQuery(e.target.value)} /></label><select aria-label="Project status" value={status} onChange={(e) => setStatus(e.target.value)}>{["All projects", ...projectStatuses].map((value) => <option key={value}>{value}</option>)}</select></div>
    <div className="manager-results" role="status">{filtered.length} of {projects.length} projects</div>
    <section className="manager-project-list" aria-label="Projects">
      {filtered.map((project) => <article className="manager-project-row" key={project.id}>
        <div className="manager-project-name"><span>{project.client}</span><h2><Link href={`/project/manage/${project.id}`}>{project.name}</Link></h2><p>{project.owner} · Handover {formatDate(project.due, true)}</p></div>
        <div className="manager-project-progress"><Status status={project.status} /><span>{progress(project)}% complete</span></div>
        <div className="manager-row-actions"><Link className="manager-secondary" href={`/project/manage/${project.id}`}>Edit project</Link><Link href={`/project/${project.id}`}>Client view<ArrowUpRight size={14} /></Link></div>
      </article>)}
      {filtered.length === 0 && <div className="manager-empty"><h2>No matching projects</h2><p>Try another client name or status.</p><button onClick={() => { setQuery(""); setStatus("All projects"); }}>Clear filters</button></div>}
    </section>
  </>;
}
