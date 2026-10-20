import "server-only";

import type { InternalProject, Project, ProjectUpdate } from "./types";
export const workspace = {
  client: "Bakso Denny",
  snapshot: "2026-10-19T10:30:00+08:00",
  manager: "Nadia",
  email: "hello@activid.id",
};


const softwareModules = [
  { name: "Catalog & pricing", description: "Product catalog, price lists, units, and customer-specific pricing.", complete: 8, total: 8 },
  { name: "Customers & territories", description: "Customer records, sales territories, and credit limits.", complete: 6, total: 6 },
  { name: "Sales & order approvals", description: "Sales orders, approval routing, discounts, and order status.", complete: 8, total: 12 },
  { name: "Inventory & warehouses", description: "Stock availability, warehouse transfers, and movement history.", complete: 7, total: 10 },
  { name: "Invoices & collections", description: "Invoice generation, payment allocation, and receivables.", complete: 3, total: 8 },
  { name: "Reports & access roles", description: "Sales reporting, permission groups, and audit history.", complete: 2, total: 6 },
];

export const distributorProject: InternalProject = {
  id: "distributor-management-system",
  client: "Nusantara Distribusi",
  internalNotes: "Reserve a backend pairing session for the warehouse integration before the UAT handover. Keep delivery capacity and commercial discussions inside the staff workspace.",
  name: "Distributor management system",
  category: "Software development",
  status: "In progress",
  summary: "One connected workspace for your sales orders, warehouse stock, customer accounts, and collections.",
  preview: "software",
  completedTasks: softwareModules.reduce((sum, module) => sum + module.complete, 0),
  totalTasks: softwareModules.reduce((sum, module) => sum + module.total, 0),
  due: "2026-11-20", updated: "2026-10-19T14:00:00+08:00", owner: "Reza", initials: "RE",
  next: "Confirm the order-approval and credit-limit rules by 22 Oct so we can complete the approval workflow.",
  importantDates: [
    { id: "approval-rules-review", title: "Approval rules review", date: "2026-10-22", note: "Sales and finance leads confirm credit-limit and order-approval rules." },
    { id: "testing-briefing", title: "Client testing briefing", date: "2026-11-04", note: "Walk your sales, warehouse, and finance representatives through the testing scenarios." },
    { id: "operations-training", title: "Operations training", date: "2026-11-18", note: "Train the operations team and project administrators before handover." },
  ],
  history: [
    { id: "sprint-review", type: "Meeting", date: "2026-10-19", title: "Development progress review", summary: "Reviewed the order workflow and agreed on the sales, warehouse, and finance scenarios for user testing.", context: "Online · Client leads and ACTIVID" },
    { id: "warehouse-visit", type: "Visit", date: "2026-10-16", title: "Warehouse workflow visit", summary: "Walked through receiving, stock transfers, and dispatch to confirm how orders should reserve stock.", context: "Manado warehouse · Operations and ACTIVID" },
    { id: "approval-flow-change", type: "Change", date: "2026-10-14", title: "Order-approval flow revised", summary: "Updated the draft to include a finance review for orders above credit limits. Final rules remain pending confirmation.", context: "Updated by Reza · Within the agreed scope" },
  ],
  milestones: [
    { name: "Discovery", date: "2026-09-11", description: "Sales, warehouse, and finance workflows mapped. The release scope and acceptance criteria are agreed.", state: "done" },
    { name: "Design", date: "2026-09-25", description: "Core screens and the mobile order flow reviewed with your operations team.", state: "done" },
    { name: "Development", date: "2026-10-30", description: "Building order approvals, stock movement, invoicing, and access roles. Regression checks run alongside development.", state: "current" },
    { name: "User testing", date: "2026-11-06", description: "Your sales, warehouse, and finance representatives test the agreed scenarios on staging. Findings are triaged with the team.", state: "upcoming" },
    { name: "Launch", date: "2026-11-13", description: "Target launch after UAT sign-off, opening-stock validation, and the final deployment checklist.", state: "upcoming" },
    { name: "Handover", date: "2026-11-20", description: "Operations training, admin documentation, and the first week of post-launch support completed.", state: "upcoming" },
  ],
  software: {
    reference: "ACT-DMS-2026", started: "2026-09-07",
    sprint: { name: "Sprint 4 of 6", start: "2026-10-19", end: "2026-10-30", goal: "Connect orders to stock, approvals, and invoicing.", work: ["Complete the sales-order approval flow", "Connect stock reservation and warehouse transfers", "Build invoice generation and payment allocation"] },
    modules: softwareModules,
    checks: { passed: 52, pending: 10, blocked: 2, note: "Two credit-limit scenarios are waiting on the final order-approval rules. Ten remaining checks will run as the unfinished features are delivered." },
    decision: { title: "Confirm order-approval rules", due: "2026-10-22", description: "We need one agreed approval matrix before completing credit-limit handling. Please confirm these three points with your sales and finance leads.", options: ["Who approves orders that exceed a customer’s credit limit?", "Which discount threshold requires a sales manager’s approval?", "Can finance release a blocked order after payment is received?"] },
  },
};

export const projects: InternalProject[] = [
  distributorProject,
  {
    id: "brand-identity", client: "Bakso Denny", internalNotes: "Coordinate the next client checkpoint with the assigned lead.", name: "A fresh identity", category: "Brand identity", status: "Needs review",
    summary: "A familiar favourite, with a fresh face. Your new visual identity is ready for a closer look.",
    preview: "identity", completedTasks: 12, totalTasks: 16, due: "2026-10-23", updated: "2026-10-19T10:30:00+08:00",
    owner: "Nadia", initials: "NA", next: "Share your feedback on the logo direction by 21 Oct.",
    milestones: [
      { name: "Discovery", date: "2026-10-05", description: "Brand workshop, audience research, and creative direction agreed.", state: "done" },
      { name: "Concepts", date: "2026-10-14", description: "Three logo routes explored. The warm, familiar direction was selected.", state: "done" },
      { name: "Your review", date: "2026-10-21", description: "Review the visual direction with Nadia. Send one consolidated round of feedback on the logo, palette, and typography.", state: "current" },
      { name: "Handover", date: "2026-10-23", description: "Final logo files, colour specifications, and a practical brand guide, after your approval.", state: "upcoming" },
    ],
  },
  {
    id: "website", client: "Bakso Denny", internalNotes: "Coordinate the next client checkpoint with the assigned lead.", name: "Your new digital home", category: "Website development", status: "In progress",
    summary: "A welcoming, mobile-first website that helps customers find your menu and locations.",
    preview: "website", completedTasks: 5, totalTasks: 10, due: "2026-11-06", updated: "2026-10-18T15:00:00+08:00",
    owner: "Reza", initials: "RE", next: "Our team is building the menu and location pages. No action needed from you.",
    milestones: [
      { name: "Planning", date: "2026-10-08", description: "Site map, content needs, and mobile wireframes confirmed.", state: "done" },
      { name: "Design", date: "2026-10-15", description: "Homepage and mobile navigation approved for development.", state: "done" },
      { name: "Development", date: "2026-10-28", description: "Menu and location pages are being built and tested across screen sizes.", state: "current" },
      { name: "Launch", date: "2026-11-06", description: "Final content check, device testing, and launch after your sign-off.", state: "upcoming" },
    ],
  },
  {
    id: "menu-photography", client: "Bakso Denny", internalNotes: "Coordinate the next client checkpoint with the assigned lead.", name: "Good food, great light", category: "Product photography", status: "In progress",
    summary: "A new menu deserves a good first impression. The shoot is wrapped; final retouching is underway.",
    preview: "photography", completedTasks: 9, totalTasks: 10, due: "2026-10-22", updated: "2026-10-18T11:00:00+08:00",
    owner: "Dimas", initials: "DI", next: "Final image selection lands on 22 Oct. We’ll walk you through the gallery.",
    milestones: [
      { name: "Art direction", date: "2026-10-09", description: "Shot list, styling references, and shoot schedule agreed.", state: "done" },
      { name: "The shoot", date: "2026-10-16", description: "All ten menu compositions captured at the studio.", state: "done" },
      { name: "Retouching", date: "2026-10-20", description: "Colour, texture, and final crops are being refined for web and social.", state: "current" },
      { name: "Delivery", date: "2026-10-22", description: "Ten finished images in high-resolution and web-ready formats.", state: "upcoming" },
    ],
  },
  {
    id: "social-starter", client: "Bakso Denny", internalNotes: "Coordinate the next client checkpoint with the assigned lead.", name: "Ready for your feed", category: "Social media", status: "Completed",
    summary: "Your social starter kit is wrapped up: a consistent look, a clear voice, and a plan for what comes next.",
    preview: "social", completedTasks: 12, totalTasks: 12, due: "2026-10-16", updated: "2026-10-16T14:00:00+08:00",
    owner: "Alya", initials: "AL", next: "All deliverables have been handed over. Contact us if you need a hand getting started.",
    milestones: [
      { name: "Strategy", date: "2026-10-02", description: "Content pillars, voice, and the first month’s publishing plan confirmed.", state: "done" },
      { name: "Creation", date: "2026-10-09", description: "Twelve launch posts and reusable story templates created.", state: "done" },
      { name: "Review", date: "2026-10-14", description: "Your feedback incorporated and final artwork approved.", state: "done" },
      { name: "Handover", date: "2026-10-16", description: "All twelve posts, captions, and the publishing calendar delivered.", state: "done" },
    ],
  },
];

export const updates: ProjectUpdate[] = [
  { projectId: "distributor-management-system", date: "2026-10-19T14:00:00+08:00", author: "Reza", initials: "RE", title: "Orders are connecting to stock.", text: "The order workflow now checks warehouse availability. This sprint connects stock reservation, approval routing, and invoice generation. Your approval matrix is the next dependency." },
  { projectId: "distributor-management-system", date: "2026-10-16T16:00:00+08:00", author: "Alya", initials: "AL", title: "Your catalog and customers are ready.", text: "Product pricing, customer records, territories, and credit-limit fields have passed their agreed checks. We’re using them to test the end-to-end order journey." },
  { projectId: "distributor-management-system", date: "2026-10-14T11:00:00+08:00", author: "Nadia", initials: "NA", title: "A plan for your team’s testing.", text: "UAT is targeted for 6 November. Please nominate one representative each from sales, warehouse, and finance so we can prepare the test sessions." },
  { projectId: "brand-identity", date: "2026-10-19T10:30:00+08:00", author: "Nadia", initials: "NA", title: "Your new look is ready.", text: "We’ve refined the logo and brought the palette together. Next up: a quick review with you before we prepare the final brand guide." },
  { projectId: "website", date: "2026-10-18T15:00:00+08:00", author: "Reza", initials: "RE", title: "The homepage is taking shape.", text: "The mobile layout is built, and we’re moving on to the menu and location pages. Everything is on track for your next checkpoint." },
  { projectId: "menu-photography", date: "2026-10-18T11:00:00+08:00", author: "Dimas", initials: "DI", title: "A little polish goes a long way.", text: "Your menu shoot is in the final retouching stage. We’re balancing the colours and preparing the full-resolution images for delivery." },
];

// Construct the shared payload explicitly: internal fields never enter page props.
export function getSharedProject(slug: string, source = projects): Project | null {
  const project = source.find((item) => item.id === slug);
  if (!project) return null;
  return {
    id: project.id, client: project.client, name: project.name, category: project.category,
    status: project.status, summary: project.summary, preview: project.preview,
    completedTasks: project.completedTasks, totalTasks: project.totalTasks,
    due: project.due, updated: project.updated, owner: project.owner, initials: project.initials,
    next: project.next, focus: project.focus, sample: project.sample ?? true,
    milestones: project.milestones, importantDates: project.importantDates ?? [], history: project.history ?? [], software: project.software,
  };
}
