# Invoice verification

- `/verify`: public verification-code lookup, linked from the main navigation and footer.
- `/verify/[code]`: public invoice summary; the 32-character random code is generated on issue.
- `/verify/manage`: password-protected staff console for creating/editing invoices, changing paid/unpaid status, and downloading QR codes.

Configure the project-wide `ADMIN_PASSWORD` and `SESSION_SECRET` once (see [admin configuration](admin-auth.md)). The signing secret must contain at least 32 characters; the invoice console uses it for its signed, HTTP-only session lasting 12 hours. It uses the existing `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY` credentials.

Records live in Firestore's `verifiedInvoices` collection and are accessed only through the server's Admin SDK. Existing Firestore rules deny client access to this collection. No rules deployment or new index is required. Do not publish a collection listing or embed invoice data in client-side seed files.

Issue an invoice in the console, download its QR PNG, and place it on the corresponding document. Download the QR from the production domain before distributing it: the QR points to the domain where the console is open. An update preserves the code, so previously printed QR codes continue to work. Public records use fresh reads on each request, and saving also invalidates the route. Invoice details and admin routes are excluded from search indexing.

Invoices currently use whole IDR unit prices, positive whole quantities, a date sent per line item, and paid/unpaid status. The total is calculated from line items on the server. Paid invoices show zero due and a paid-in-full notice. These records are public to anyone holding the link; include only recipient-facing details. The console manages the verification record and QR, not the invoice PDF itself.
