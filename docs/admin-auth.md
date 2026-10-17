# Admin configuration

Set `ADMIN_PASSWORD` and `SESSION_SECRET` once in the server environment. Use a random secret of at least 32 characters. All shared-password admin entry points use these settings:

- `/verify/manage` — issued invoices.
- `/link/manage` — redirect links.
- `/invitation/register` — invitation registration and editing.
- `/invitation/verify-affiliate` — affiliate approval.

Move your existing admin password into `ADMIN_PASSWORD` before deploying. Remove `INVITATION_ADMIN_PASSWORD`, `LINK_ADMIN_PASSWORD`, and `VERIFY_ADMIN_PASSWORD`; these per-feature password settings are no longer read. There is no default password or legacy-password fallback.

Password configuration and comparison live in the server-only `lib/admin-password.ts` module. Affiliate account passwords and Firebase/Google sign-in are independent account credentials.

All application-signed sessions and guest tokens read `SESSION_SECRET` through the server-only `lib/session-secret.ts` module, including invitation admin/affiliate sessions, link admin sessions, invoice admin sessions, and Kenangan guest tokens. Remove `INVITATION_REGISTER_SESSION_SECRET`, `VERIFY_ADMIN_SESSION_SECRET`, and `KENANGAN_GUEST_TOKEN_SECRET`; they are no longer read. Existing session lifetimes, cookie scopes, and role checks are unchanged.

Changing the signing secret invalidates existing sessions and Kenangan guest links. After migrating, sign in again and regenerate any affected guest links. Third-party service credentials continue to use their provider-issued values.
