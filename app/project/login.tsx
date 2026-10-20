"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Asterisk, LockKeyhole } from "lucide-react";
import { loginProjectAdmin } from "./actions";

export default function ProjectLogin({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(loginProjectAdmin, {});
  return <main className="project-login">
    <Link href="/" className="activid-wordmark" aria-label="ACTIVID home">activid<Asterisk className="brand-asterisk" strokeWidth={3.5} /></Link>
    <div className="project-login-panel">
      <LockKeyhole size={27} strokeWidth={1.5} />
      <h1>Staff workspace</h1>
      <p>Sign in to view the internal project portfolio and manage client handovers.</p>
      {configured ? <form action={action}>
        <label>Admin password<input name="password" type="password" autoComplete="current-password" required maxLength={1000} /></label>
        {state.error && <p role="alert" className="login-error">{state.error}</p>}
        <button disabled={pending}>{pending ? "Signing in…" : "Sign in"}<ArrowRight size={17} /></button>
      </form> : <div className="login-unconfigured"><p>Staff sign-in is not configured.</p><p>Configure the existing <code>ADMIN_PASSWORD</code> and <code>SESSION_SECRET</code> settings to enable access.</p></div>}
      <span className="login-footnote">Client project links open separately. This workspace is for the ACTIVID team.</span>
    </div>
  </main>;
}
