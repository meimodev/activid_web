# Project calendar setup

Each project can connect to its own private Google secondary calendar. Important
dates and activity history (meetings, visits, and changes) become all-day events.
Timeline phases become all-day spans with inclusive start and end dates; Google
receives the following day as its exclusive end. The client calendar includes
every day of a phase, shows the number of overlapping phases, and lists all
events for the selected date. The project page is the schedule source: Google
edits are not imported.

## Connect a calendar

1. In Google Calendar on desktop, create a new calendar named after the project.
   Share it with the client using **See event details** (or **See all event
   details**). This lets the client subscribe and view updates without editing.
2. Enable the **Google Calendar API** in the app service account's Cloud project.
3. Share the calendar with the service account using **Make changes to events**.
4. In the calendar settings, copy the ID under **Integrate calendar**.
5. Sign in to `/project/manage`, edit the project, open **Dates**, paste the ID,
   and save. Successful sync adds an **Add to Google Calendar** subscription link to the
   client card. The link uses Google's base64 calendar ID format. Google sharing
   permissions control access; the link alone does not grant view or edit rights.

Authentication uses the existing `FIREBASE_ADMIN_CLIENT_EMAIL` and
`FIREBASE_ADMIN_PRIVATE_KEY`. For a separate calendar service account, set both
`GOOGLE_CALENDAR_CLIENT_EMAIL` and `GOOGLE_CALENDAR_PRIVATE_KEY` on the server.
No credential is exposed to the shared client page. The staff setup panel shows
only the service account email. Local secrets belong in `.env.development.local`;
production secrets belong in the Vercel environment, followed by a deployment.

## Behavior and recovery

- Every save reconciles important dates, timeline phases, activity history, and target handover.
  Events are tagged by project and entry; edits update the existing event.
  Removed entries delete only that project's tagged events. Other events remain.
- Only secondary calendar IDs (`…@group.calendar.google.com`) are accepted.
  A calendar is reserved to one project, including after disconnection, to keep
  project calendars separate. The studio booking calendar's global
  `GOOGLE_CALENDAR_ID` is never used by project tracking.
- Changing the ID removes the project's managed events from the previous calendar
  before populating the new one. Clearing it removes those events without deleting
  the calendar or changing its sharing permissions.
- Project edits are saved before sync. An API error appears in admin; save again
  to retry. A partially completed sync is reconciled on the next save. Until an
  initial sync succeeds, the client page does not show a Google Calendar link.
  If Google reports read-only access, change the service account's permission
  from **See all event details** to **Make changes to events**. Read access alone
  can list dates but cannot sync them.
- A Firestore lease serializes saves during sync; interrupted leases expire after
  five minutes. Local storage uses its existing project file lock.
- Existing phases without a start date retain their end date as their start until
  staff enter the actual range in **Timeline**. Dates are validated on save.

Calendar API behavior: [events reference](https://developers.google.com/workspace/calendar/api/v3/reference/events),
[service account authentication](https://developers.google.com/identity/protocols/oauth2/service-account),
[create a calendar](https://support.google.com/calendar/answer/37095).
