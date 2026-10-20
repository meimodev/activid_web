"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowDown, ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, CalendarDays, CheckCheck, ChevronDown, Clock3, LayoutGrid, Mail, MessageCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { formatDate, progress, visibleProjects } from "./format";
import type { InternalProject, Project, ProjectUpdate } from "./types";
import { logoutProjectAdmin } from "./actions";
import { Milestones, Preview, Status } from "./project-ui";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const filters = ["All projects", "In progress", "Needs review", "Completed"];


function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  const percentage = progress(project);
  return (
    <article className="project-card">
      <Preview kind={project.preview} />
      <div className="project-card-body">
        <div className="project-meta"><span>{project.client} · {project.category}</span><Status status={project.status} /></div>
        <h3><button className="project-open" onClick={() => onOpen(project)}>{project.name}<ArrowUpRight size={20} /></button></h3>
        <p className="project-description">{project.summary}</p>
        <div className="progress-label"><span>{project.status === "Completed" ? "All delivered" : `${project.completedTasks} of ${project.totalTasks} tasks complete`}</span><span>{percentage}%</span></div>
        <div className="project-progress" role="progressbar" aria-label={`${project.name} progress`} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percentage}%` }} /></div>
        <div className="project-card-footer"><span><CalendarDays size={15} />{project.status === "Completed" ? "Delivered" : "Delivery"} {formatDate(project.due)}</span><span className="owner"><span className={`avatar avatar-${project.initials}`}>{project.initials}</span>{project.owner}</span></div>
      </div>
    </article>
  );
}


export default function ProjectsWorkspace({ projects, updates, workspace }: { projects: InternalProject[]; updates: ProjectUpdate[]; workspace: { client: string; snapshot: string; manager: string; email: string } }) {
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All projects");
  const [sort, setSort] = useState("updated");
  const [selected, setSelected] = useState<Project>(projects[0]);
  const [updateIndex, setUpdateIndex] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const filtered = visibleProjects(projects, query, filter, sort);
  const reviewProject = projects.find((project) => project.status === "Needs review");
  const update = updates[updateIndex];
  const updateProject = projects.find((project) => project.id === update.projectId)!;
  const openProject = (project: Project) => {
    setSelected(project);
    dialog.current?.showModal();
  };
  const contactHref = `mailto:${workspace.email}?subject=${encodeURIComponent(`${workspace.client} — project update`)}`;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".closing-words span", { opacity: 0.18, stagger: 0.15, scrollTrigger: { trigger: ".projects-closing", start: "top 95%", end: "top 55%", scrub: true } });
    });
    media.add("(min-width: 1000px) and (prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({ trigger: ".updates-intro", start: "top 140px", endTrigger: ".updates-section", end: "bottom 330px", pin: true, pinSpacing: false });
    });
    return () => media.revert();
  }, { scope: root });

  function downloadSummary() {
    const body = ["ACTIVID / Internal project summary", workspace.client, `Updated: ${formatDate(workspace.snapshot, true)}`, "", ...projects.flatMap((project) => [project.name, `${project.category} | ${project.status} | ${progress(project)}% complete`, `Delivery: ${formatDate(project.due, true)} | Lead: ${project.owner}`, `Next: ${project.next}`, ""])].join("\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "activid-project-summary.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div ref={root}>
      <a className="projects-skip" href="#projects-content">Skip to projects</a>
      <header className="projects-header">
        <div className="projects-nav">
          <Link className="activid-wordmark" href="/" aria-label="ACTIVID home">activid<Asterisk className="brand-asterisk" aria-hidden="true" strokeWidth={3.5} /></Link>
          <span className="workspace-divider" />
          <span className="workspace-name">{workspace.client}<span>Internal project workspace</span></span>
          <nav aria-label="Staff workspace" className={mobileNavOpen ? "nav-links nav-open" : "nav-links"}>
            <a href="#your-projects" className="nav-current" onClick={() => setMobileNavOpen(false)}>Projects</a>
            <Link href="/project/manage">Manage projects</Link>
            <a href="#project-updates" onClick={() => setMobileNavOpen(false)}>Updates</a>
            <a href={contactHref}>Contact team <ArrowUpRight size={14} /></a>
          </nav>
          <form action={logoutProjectAdmin} className="staff-signout"><button type="submit">Sign out</button></form>
          <button className="mobile-nav-button" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen(!mobileNavOpen)}>{mobileNavOpen ? <X size={21} /> : <LayoutGrid size={20} />}</button>
        </div>
      </header>

      <main id="projects-content" className="projects-main overflow-x-hidden w-full max-w-full">
        <div className="workspace-container">
          <div className="demo-notice"><span><span className="demo-dot" />Internal workspace <span className="notice-detail">— includes sample projects</span></span><span>Updated · {formatDate(projects[0]?.updated ?? workspace.snapshot, true)}</span></div>

          <section className="workspace-intro" aria-labelledby="workspace-title">
            <h1 id="workspace-title" className="max-w-5xl">Projects.<br />A clear overview.</h1>
            <div className="intro-note"><p>The ACTIVID delivery workspace.<br />Track projects and open their client views.</p><button className="text-action" onClick={downloadSummary}><ArrowDownToLine size={16} /> Download summary</button></div>
          </section>

          <section className="workspace-overview" aria-label="Project overview">
            {[{ label: "Total projects", count: projects.length }, { label: "In progress", count: projects.filter((p) => p.status === "In progress").length }, { label: "Needs review", count: projects.filter((p) => p.status === "Needs review").length }, { label: "Completed", count: projects.filter((p) => p.status === "Completed").length }].map((metric) => <div className="overview-metric" key={metric.label}><span>{metric.label}</span><strong>{metric.count}</strong></div>)}
          </section>

          {reviewProject && <aside className="next-action"><span className="action-icon"><MessageCircle size={20} strokeWidth={1.6} /></span><div><strong>A client decision is coming up.</strong><p>{reviewProject.next}</p></div><button onClick={() => openProject(reviewProject)}>Review project <ArrowUpRight size={16} /></button></aside>}

          <section id="your-projects" className="your-projects" aria-labelledby="projects-title">
            <div className="section-title-row"><div><h2 id="projects-title">Project portfolio<span className="project-total">{projects.length}</span></h2><p>Internal overview. Each project has its own client-facing link.</p></div><span className="workspace-date"><CalendarDays size={15} />October 2026</span></div>
            <div className="project-controls">
              <div className="project-filters" role="group" aria-label="Filter projects by status">{filters.map((status) => <button key={status} aria-pressed={filter === status} className={filter === status ? "filter-active" : ""} onClick={() => setFilter(status)}>{status === "In progress" && <span className="filter-dot" />}{status}<span>{status === "All projects" ? projects.length : projects.filter((p) => p.status === status).length}</span></button>)}</div>
              <div className="search-sort"><label className="project-search"><Search size={17} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a project" aria-label="Search projects" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</label><label className="project-sort"><SlidersHorizontal size={16} /><select aria-label="Sort projects" value={sort} onChange={(event) => setSort(event.target.value)}><option value="updated">Latest update</option><option value="due">Delivery date</option></select><ChevronDown size={13} /></label></div>
            </div>
            <p className="sr-only" role="status">{filtered.length} {filtered.length === 1 ? "project" : "projects"} found</p>
            <div className="projects-grid grid-flow-dense">
              {filtered.map((project) => <ProjectCard key={project.id} project={project} onOpen={openProject} />)}
              {filtered.length === 0 && <div className="projects-empty"><Search size={27} /><h3>No projects found</h3><p>Try another name or choose a different status.</p><button onClick={() => { setQuery(""); setFilter("All projects"); }}>Clear filters <ArrowRight size={16} /></button></div>}
            </div>
            <div className="projects-list-foot"><span>Showing {filtered.length} of {projects.length} projects</span><span><CheckCheck size={15} />Your next step is always clear.</span></div>
          </section>

          <section id="project-updates" className="updates-section" aria-labelledby="updates-title">
            <div className="updates-intro"><span className="section-symbol" aria-hidden="true">↳</span><h2 id="updates-title">Behind the<br />good work.</h2><p>Small steps. Thoughtful decisions.<br />The latest from your creative team.</p><div className="update-arrows"><button aria-label="Previous update" onClick={() => setUpdateIndex((updateIndex - 1 + updates.length) % updates.length)}><ArrowLeft size={19} /></button><button aria-label="Next update" onClick={() => setUpdateIndex((updateIndex + 1) % updates.length)}><ArrowRight size={19} /></button><span>{updateIndex + 1} / {updates.length}</span></div></div>
            <div className="update-card" aria-live="polite" aria-atomic="true"><div className="update-author"><span className={`avatar avatar-${update.initials}`}>{update.initials}</span><span><strong>{update.author}</strong><small>{updateProject.category} lead</small></span><time dateTime={update.date}>{formatDate(update.date)}</time></div><h3>{update.title}</h3><p>{update.text}</p><button className="update-project-link" onClick={() => openProject(updateProject)}><span className={`update-thumbnail thumb-${updateProject.preview}`}><ArrowUpRight size={18} /></span><span>{updateProject.name}<small>View project & milestones</small></span><ArrowUpRight size={19} /></button><div className="update-pagination" aria-label="Choose an update">{updates.map((item, index) => <button key={`${item.projectId}-${item.date}-${index}`} aria-label={`Update ${index + 1}: ${item.title}`} aria-pressed={index === updateIndex} onClick={() => setUpdateIndex(index)}><span /></button>)}</div></div>
          </section>

          <section className="projects-closing" aria-labelledby="closing-title"><div><p className="closing-words"><span>Good</span> <span>things</span> <span>happen</span><br /><span>when</span> <span>we</span> <span>talk.</span></p><h2 id="closing-title">A question, an idea, a little feedback?</h2><p>Your project lead {workspace.manager} is here to help.</p></div><a href={contactHref}>Let’s talk <ArrowUpRight size={22} /></a></section>
          <footer className="projects-footer"><Link href="/" className="footer-wordmark">activid<Asterisk aria-hidden="true" strokeWidth={3.5} /></Link><span>Thoughtful work. Together.</span><a href="#projects-content">Back to top <ArrowDown size={14} /></a></footer>
        </div>
      </main>

      <dialog ref={dialog} className="project-dialog" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} aria-labelledby="detail-title">
        <div className="dialog-content"><div className="dialog-top"><span>Project overview</span><button aria-label="Close project details" onClick={() => dialog.current?.close()}><X size={22} /></button></div><Preview kind={selected.preview} compact /><div className="dialog-body"><div className="project-meta"><span>{selected.category}</span><Status status={selected.status} /></div><h2 id="detail-title">{selected.name}</h2><p className="detail-summary">{selected.summary}</p><div className="detail-facts"><div><span>Progress</span><strong>{progress(selected)}%</strong></div><div><span>{selected.status === "Completed" ? "Delivered" : "Delivery"}</span><strong>{formatDate(selected.due)}</strong></div><div><span>Project lead</span><strong>{selected.owner}</strong></div></div><div className="project-progress" role="progressbar" aria-label="Project completion" aria-valuenow={progress(selected)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress(selected)}%` }} /></div><section className="detail-next"><h3>{selected.status === "Needs review" ? "Over to you" : selected.status === "Completed" ? "All wrapped up" : "What happens next"}</h3><p>{selected.next}</p></section><section className="internal-project-note"><h3>Internal team note</h3><p>{projects.find((project) => project.id === selected.id)?.internalNotes}</p></section><Link className="shared-project-link" href={`/project/manage/${selected.id}`}>Edit project <ArrowUpRight size={17} /></Link><Link className="shared-project-link" href={`/project/${selected.id}`}>Open client view <ArrowUpRight size={17} /></Link><section className="detail-milestones"><h3>Your project journey</h3><Milestones key={selected.id} project={selected} /></section><div className="detail-updated"><Clock3 size={14} />Updated · {formatDate(selected.updated, true)}</div><a className="detail-contact" href={`mailto:${workspace.email}?subject=${encodeURIComponent(`${workspace.client} — ${selected.name}`)}&body=${encodeURIComponent(`Hi ${selected.owner},\n\nI’d like to discuss ${selected.name}.\n\n`)}`}><Mail size={17} />{selected.status === "Needs review" ? "Send feedback to your team" : "Talk to your project lead"}<ArrowUpRight size={17} /></a><p className="detail-demo">Internal workspace. Use Edit project to update client progress, milestones, and history.</p></div></div>
      </dialog>
    </div>
  );
}
