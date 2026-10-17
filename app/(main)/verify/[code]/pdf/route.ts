import { NextRequest } from "next/server";
import { generateInvoicePDF } from "@/lib/invoice-pdf";
import { getVerifiedInvoice } from "@/lib/verified-invoice-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  try {
    const invoice = await getVerifiedInvoice(code);
    if (!invoice) return new Response("Invoice not found.", { status: 404 });
    const origin = process.env.NODE_ENV === "production" ? "https://www.activid.id" : request.nextUrl.origin;
    const pdf = await generateInvoicePDF(invoice, new URL(`/verify/${code}`, origin).toString());
    const filename = invoice.invoiceNumber.replace(/[^a-z0-9_-]/gi, "-").slice(0, 100);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("Could not generate invoice PDF", error);
    return new Response("The invoice PDF is temporarily unavailable. Please try again.", { status: 503 });
  }
}
