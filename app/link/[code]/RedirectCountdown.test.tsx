import { StrictMode } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FieldValue } from "firebase-admin/firestore";
import { recordLinkOpen } from "./actions";
import { RedirectCountdown } from "./RedirectCountdown";

const { update, doc, collection, getRedirectLink } = vi.hoisted(() => ({
  update: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
  getRedirectLink: vi.fn(),
}));

vi.mock("@/lib/firebase-admin", () => ({
  getAdminDb: () => ({ collection }),
}));
vi.mock("@/lib/redirect-link", () => ({ getRedirectLink }));

beforeEach(() => {
  vi.clearAllMocks();
  getRedirectLink.mockResolvedValue({ active: true });
  update.mockResolvedValue(undefined);
  doc.mockReturnValue({ update });
  collection.mockReturnValue({ doc });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("link open counter", () => {
  it("uses an atomic increment for each open", async () => {
    await Promise.all([recordLinkOpen("abcdef12"), recordLinkOpen("abcdef12")]);
    expect(collection).toHaveBeenCalledWith("redirectLinks");
    expect(doc).toHaveBeenCalledWith("abcdef12");
    expect(update).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenCalledWith({ openCount: FieldValue.increment(1) });
  });

  it("does not write for missing or inactive links", async () => {
    getRedirectLink.mockResolvedValueOnce(null).mockResolvedValueOnce({ active: false });
    await recordLinkOpen("invalid");
    await recordLinkOpen("abcdef12");
    expect(update).not.toHaveBeenCalled();
  });

  it("counts once in Strict Mode and counts a new visit again", async () => {
    const page = <StrictMode><RedirectCountdown code="abcdef12" url="https://example.com/" /></StrictMode>;
    const firstVisit = render(page);
    await act(async () => {});
    firstVisit.rerender(page);
    expect(update).toHaveBeenCalledTimes(1);
    firstVisit.unmount();
    render(page);
    await act(async () => {});
    expect(update).toHaveBeenCalledTimes(2);
  });

  it("keeps the redirect armed when counting fails", async () => {
    update.mockRejectedValueOnce(new Error("Firestore unavailable"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<RedirectCountdown code="abcdef12" url="https://example.com/" />);
    await act(async () => {});
    expect(error).toHaveBeenCalled();
    const link = screen.getByRole("link", { name: "Lanjutkan" });
    expect(link).toHaveAttribute("href", "https://example.com/");
    expect(link).toHaveAttribute("data-armed");
  });
});
