"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { formatDate } from "./format";
import type { Project } from "./types";

export function Status({ status }: { status: Project["status"] }) {
  return <span className={`project-status status-${status.toLowerCase().replaceAll(" ", "-")}`}><span />{status}</span>;
}

export function Preview({ kind, compact = false }: { kind: Project["preview"]; compact?: boolean }) {
  return (
    <div className={`project-preview preview-${kind} ${compact ? "preview-compact" : ""}`} aria-hidden="true">
      <div className="preview-art">
        <svg viewBox="0 0 560 198" preserveAspectRatio="xMidYMid slice" focusable="false">
          {kind === "software" && <>
            <rect width="560" height="198" fill="#dce7e2" />
            <g transform="translate(72 18)"><rect width="416" height="230" rx="8" fill="#fcfdfa" /><rect width="86" height="230" rx="8" fill="#eef2eb" />
            <text x="13" y="28" fill="#28543f" fontSize="15" fontWeight="700">Nusantara</text>
            {["Overview", "Customers", "Orders", "Inventory", "Invoices"].map((label,index) => <text key={label} x="13" y={56+index*26} fontSize="12" fill="#647261">{label}</text>)}
            <text x="103" y="30" fontSize="19" fill="#283d30">Distributor operations</text>
            <text x="103" y="53" fontSize="12" fill="#647261">Catalog → Orders → Inventory → Invoices</text>
            {[["Catalog & pricing", "Complete"], ["Sales orders", "Building"], ["Stock movement", "Building"]].map(([label,status],index) => <g key={label} transform={`translate(103 ${76+index*35})`}><path d="M0 24h291" stroke="#e2e8dd" /><text y="11" fontSize="13" fill="#344d3b">{label}</text><text x="280" y="11" textAnchor="end" fontSize="12" fill="#477d59">{status}</text></g>)}
            </g>
          </>}
          {kind === "identity" && <>
            <text x="280" y="42" textAnchor="middle" fill="#e9ebce" fontSize="13">Made with heart. Served with love.</text>
            <text x="280" y="128" textAnchor="middle" fill="#e9ebce" fontSize="90" fontWeight="700" letterSpacing="-7">denny<tspan fill="#e7b965">’</tspan>s</text>
            <g transform="translate(408 63)" stroke="#e7b965" strokeWidth="3"><path d="M-8 0h16M-4-7l8 14M4-7l-8 14" /></g>
            <text x="280" y="157" textAnchor="middle" fill="#e9ebce" fontSize="13">A familiar kind of good.</text>
            <g transform="translate(511 158) rotate(12)"><circle r="19" fill="none" stroke="#9aaf91" strokeWidth=".8" /><text textAnchor="middle" fill="#e9ebce" fontSize="13"><tspan x="0" y="-2">EST.</tspan><tspan x="0" dy="9">2008</tspan></text></g>
          </>}
          {kind === "website" && <g transform="translate(100 27) rotate(-5 180 100)">
            <rect width="360" height="240" rx="5" fill="#f9f6ec" /><path d="M5 0h350a5 5 0 0 1 5 5v14H0V5a5 5 0 0 1 5-5" fill="white" />
            {[10, 16, 22].map((x) => <circle key={x} cx={x} cy="9" r="1.5" fill="#cdd2ca" />)}
            <text x="180" y="12" textAnchor="middle" fontSize="13" fill="#687360">dennys.kitchen</text>
            <text x="22" y="53" fontSize="19" fontWeight="700" letterSpacing="-1" fill="#254e3b">denny’s</text>
            <text x="337" y="49" textAnchor="end" fontSize="13" fill="#536450">Menu   Locations   Our story</text>
            <defs><clipPath id={`web-photo-${compact ? "detail" : "card"}`}><path d="M236 173V116a48 48 0 0 1 96 0v57z" /></clipPath></defs>
            <image href="/images/social-media/fnb-grid.png" x="236" y="68" width="96" height="115" preserveAspectRatio="xMidYMid slice" clipPath={`url(#web-photo-${compact ? "detail" : "card"})`} />
            <text x="22" y="114" fontSize="31" letterSpacing="-1.5" fill="#254e3b"><tspan x="22">Good food.</tspan><tspan x="22" dy="30">Better together.</tspan></text>
            <rect x="22" y="162" width="108" height="23" rx="3" fill="#284d39" /><text x="32" y="177" fontSize="13" fill="white">Find your favourite ↗</text>
          </g>}
          {kind === "photography" && <>
            <image href="/images/social-media/fnb-grid.png" width="560" height="198" preserveAspectRatio="xMidYMid slice" />
            <rect width="560" height="198" fill="#16170f" opacity=".45" />
            <text x="120" y="64" fontSize="37" letterSpacing="-1.5" fill="#fff9e8"><tspan x="120">Fresh from</tspan><tspan x="120" dy="36">the kitchen.</tspan></text>
            <text x="120" y="176" fontSize="13" fill="#fff9e8">Denny’s / Menu collection</text>
          </>}
          {kind === "social" && <>
            <g transform="translate(65 29) rotate(-9 65 80)"><rect width="130" height="162" fill="#e5b75f" /><text x="12" y="24" fontSize="13" fontWeight="700" fill="#30462f">denny’s</text><text x="12" y="71" fontSize="25" letterSpacing="-1" fill="#30462f"><tspan x="12">Same heart.</tspan><tspan x="12" dy="25">Fresh start.</tspan></text><text x="12" y="148" fontSize="13" fill="#30462f">Something good.</text></g>
            <g transform="translate(211 20) rotate(4 65 80)"><image href="/images/social-media/coffee-grid.jpg" width="130" height="162" preserveAspectRatio="xMidYMid slice" /><rect width="130" height="162" fill="#16170f" opacity=".4" /><text x="12" y="109" fontSize="23" fill="#fff9df" letterSpacing="-1"><tspan x="12">Take a little</tspan><tspan x="12" dy="23">time for good.</tspan></text></g>
            <g transform="translate(357 33) rotate(11 65 80)"><rect width="130" height="162" fill="#244d39" /><text x="12" y="24" fontSize="13" fontWeight="700" fill="#e7eccf">denny’s</text><text x="12" y="65" fontSize="25" fill="#e7eccf" letterSpacing="-1"><tspan x="12">Made for</tspan><tspan x="12" dy="25">your kind</tspan><tspan x="12" dy="25">of day.</tspan></text><text x="12" y="148" fontSize="13" fill="#e7eccf">Come hungry.</text></g>
          </>}
        </svg>
      </div>
    </div>
  );
}

export function Milestones({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(Math.max(0, project.milestones.findIndex((milestone) => milestone.state === "current")));
  return (
    <div className="milestone-accordion">
      {project.milestones.map((milestone, index) => (
        <div className={`milestone-step ${index === expanded ? "is-expanded" : ""} milestone-${milestone.state}`} key={milestone.name}>
          <button aria-expanded={index === expanded} aria-controls={`milestone-${project.id}-${index}`} onClick={() => setExpanded(index === expanded ? -1 : index)}>
            <span className="milestone-mark">{milestone.state === "done" ? <Check size={15} /> : <span />}</span>
            <span><strong>{milestone.name}</strong><small>{formatDate(milestone.date)}</small></span>
            <ChevronDown size={16} />
          </button>
          <div id={`milestone-${project.id}-${index}`} hidden={index !== expanded}><p>{milestone.description}</p><span className="milestone-state">{milestone.state === "done" ? "Completed" : milestone.state === "current" ? "Current milestone" : "Upcoming"}</span></div>
        </div>
      ))}
    </div>
  );
}
