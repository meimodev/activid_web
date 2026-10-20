Project management lives at `/project/manage`; create at `/project/manage/new`,
edit at `/project/manage/[slug]`, and share `/project/[slug]` with the client.
The overview and management pages require the existing staff session. Every save
also verifies the session on the server.

Configure `ADMIN_PASSWORD` and a `SESSION_SECRET` of at least 32 characters for
staff sign-in. No default password or development authentication bypass is used.

When all three existing `FIREBASE_ADMIN_*` credentials are configured, project
overrides are stored in the server-only Firestore collection `clientProjects`.
The bundled sample projects appear until overridden; no automatic database
seeding or writes happen on page loads. Existing Firestore rules deny client SDK
access to this collection. Keep those rules when deploying.

Without Firebase credentials, local development and self-hosted local previews
save under `.local/projects/` (gitignored). This data survives a local restart,
but stays on that machine. Local storage is disabled on Vercel: configure
Firebase Admin there to enable saves. Do not deploy local files as project data.
`PROJECTS_LOCAL_DATA_DIR` can isolate a local test run and is ignored on Vercel.

Saving publishes client-facing fields immediately. Internal notes and revision
numbers are excluded from client props. Existing project URLs stay fixed.
Revisions reject stale saves rather than silently overwrite newer edits.
Use the Dates tab to add, edit, or remove important dates (title, date, optional
note). They are shown chronologically on the client tracker after saving.

Verification:

```
pnpm exec vitest run app/project/manage/management.test.ts app/project/data.test.ts lib/project-admin-session.test.ts
pnpm build
pnpm exec playwright test --config playwright.projects.config.ts
```

The browser configuration generates isolated credentials and temporary local
storage. It never writes to the live Firestore database.
