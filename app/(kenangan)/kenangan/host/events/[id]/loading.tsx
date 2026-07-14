import KkProgress from "@/app/(kenangan)/kenangan/KkProgress";

// Suspense fallback while the event detail page streams (Firestore reads + QR
// gen). Indeterminate bar under the same page shell the route renders.
export default function Loading() {
  return (
    <main className="kk-page" style={{ maxWidth: 640 }}>
      <KkProgress className="kk-load-progress" />
    </main>
  );
}
