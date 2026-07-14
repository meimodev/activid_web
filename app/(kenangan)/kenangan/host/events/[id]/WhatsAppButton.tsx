import { kenanganAdminWaLink } from "@/types/kenangan";

/** Ghost button that opens a WhatsApp chat with the admin, message prefilled. */
export default function WhatsAppButton({ text }: { text: string }) {
  return (
    <a
      href={kenanganAdminWaLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className="kk-btn kk-btn-ghost"
      style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8 }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-3.2 4.44c-.15 0-.4.06-.6.28-.2.22-.79.77-.79 1.88s.81 2.18.92 2.33c.11.15 1.57 2.4 3.8 3.36.53.23.95.37 1.27.47.53.17 1.02.14 1.4.09.43-.06 1.31-.54 1.5-1.06.18-.52.18-.96.13-1.06-.05-.09-.2-.15-.42-.26-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.16-.48.05-.22-.11-.93-.34-1.77-1.09-.65-.58-1.09-1.3-1.22-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.05-.11-.5-1.21-.69-1.66-.18-.43-.36-.37-.5-.38-.13 0-.28-.01-.42-.01Z" />
      </svg>
      Konfirmasi via WhatsApp
    </a>
  );
}
