"use client";

export default function ManagementError({ reset }: { reset: () => void }) {
  return <section className="manager-error"><h1>Projects unavailable</h1><p>Could not load project storage. Check the connection and try again.</p><button className="manager-secondary" onClick={reset}>Try again</button></section>;
}
