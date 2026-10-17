import "server-only";

import path from "node:path";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { formatIDR, formatInvoiceDate, INVOICE_LEGAL_NOTE, invoicePaymentSummary, type VerifiedInvoice } from "@/lib/verified-invoice";

export async function generateInvoicePDF(invoice: VerifiedInvoice, verificationURL: string): Promise<Buffer> {
  const font = path.join(process.cwd(), "public/fonts/poppins-regular.ttf");
  const bold = path.join(process.cwd(), "public/fonts/poppins-bold.ttf");
  const qr = await QRCode.toBuffer(verificationURL, { width: 480, margin: 4, errorCorrectionLevel: "M" });
  const doc = new PDFDocument({
    size: "A4", margins: { top: 44, bottom: 48, left: 44, right: 44 },
    font, bufferPages: true,
    info: { Title: `ACTIVID Invoice ${invoice.invoiceNumber}`, Author: "ACTIVID", Subject: "Invoice with online verification" },
  });
  const chunks: Buffer[] = [];
  const completed = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
  const { total, received, due, status } = invoicePaymentSummary(invoice);
  const width = doc.page.width - 88;
  const ink = "#1a1a3e";
  doc.registerFont("body", font).registerFont("bold", bold);

  function room(height: number) {
    if (doc.y + height > doc.page.height - doc.page.margins.bottom) doc.addPage();
  }
  function section(title: string) {
    room(60);
    doc.x = 44;
    doc.moveDown(0.8).font("bold").fontSize(10).fillColor(ink).text(title, { width });
    doc.moveDown(0.5);
  }
  function table(headers: string[], rows: string[][], widths: number[], rightAligned: number[] = []) {
    doc.font("body").fontSize(8).fillColor(ink);
    const options: PDFKit.Mixins.TableOptions = {
      maxWidth: width,
      columnStyles: widths.map((columnWidth, index) => ({ width: columnWidth, align: { x: rightAligned.includes(index) ? "right" : "left" } })),
      defaultStyle: { padding: 7, border: { bottom: 0.5 }, borderColor: "#dddde3", textColor: ink },
      rowStyles: (index) => index === 0 ? { backgroundColor: "#F8EFDE" } : { backgroundColor: "white" },
    };
    const start = () => doc.table(options).row(headers.map((text) => ({ text, type: "TH", font: { src: bold, size: 8 } })));
    let current = start();
    for (const row of rows) {
      const cells = row.map((value) => value.replace(/\s+/g, " "));
      const height = Math.max(...cells.map((value, index) => doc.heightOfString(value, { width: widths[index] - 14 }))) + 16;
      if (doc.y + height > doc.page.height - doc.page.margins.bottom - 2) {
        current.end();
        doc.addPage();
        current = start();
      }
      current.row(cells);
    }
    current.end();
    doc.x = 44;
  }

  doc.fillColor(ink).font("bold").fontSize(21).text("ACTIVID", 44, 44);
  doc.font("body").fontSize(8).fillColor("#6b2737").text("CREATIVE AGENCY", 44, 74);
  doc.font("bold").fontSize(26).fillColor(ink).text("INVOICE", 300, 44, { width: width - 256, align: "right" });
  doc.font("body").fontSize(9).text(invoice.invoiceNumber, 260, 82, { width: width - 216, align: "right" });
  doc.fontSize(8).fillColor("#656575").text(`Issued ${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "Asia/Makassar" }).format(new Date(invoice.createdAt))}`, 260, doc.y + 4, { width: width - 216, align: "right" });
  const headerBottom = Math.max(110, doc.y + 10);
  doc.moveTo(44, headerBottom).lineTo(44 + width, headerBottom).lineWidth(1).strokeColor(ink).stroke();
  doc.font("bold").fontSize(9).fillColor(status === "paid" ? "#166534" : "#92400e")
    .text(status === "paid" ? "PAID IN FULL" : status === "partial" ? "PARTIALLY PAID" : "AWAITING PAYMENT", 44, headerBottom + 14);
  const detailsY = doc.y + 18;
  const half = (width - 24) / 2;
  doc.font("bold").fontSize(8).fillColor("#656575").text("BILLED TO", 44, detailsY);
  doc.font("body").fontSize(10).fillColor(ink).text(invoice.billedTo, 44, doc.y + 6, { width: half });
  const billedBottom = doc.y;
  // Long recipient blocks flow on their own; payment information follows on a fresh line if needed.
  if (billedBottom > doc.page.height - 180) {
    doc.y = billedBottom;
    room(110);
  } else {
    doc.y = detailsY;
  }
  const payX = doc.y === detailsY ? 44 + half + 24 : 44;
  doc.font("bold").fontSize(8).fillColor("#656575").text("PAYABLE TO", payX, doc.y);
  doc.font("body").fontSize(10).fillColor(ink).text(invoice.payableTo, payX, doc.y + 6, { width: half });
  doc.fontSize(9).text(`${invoice.bankName}\n${invoice.accountNumber}`, payX, doc.y + 5, { width: half });
  doc.y = Math.max(doc.y, billedBottom) + 12;
  doc.x = 44;

  section("Invoice items · IDR");
  table(["Description", "Date sent", "Qty", "Unit price", "Amount"], invoice.items.map((item) => [
    item.description, formatInvoiceDate(item.dateSent), String(item.quantity), formatIDR(item.unitPrice), formatIDR(item.quantity * item.unitPrice),
  ]), [width - 337, 77, 36, 112, 112], [2, 3, 4]);

  if (invoice.payments.length > 0) {
    section("Payments received");
    table(["Payment", "Date received", "Amount"], invoice.payments.map((payment) => [
      payment.description, payment.dateReceived ? formatInvoiceDate(payment.dateReceived) : "Not recorded", formatIDR(payment.amount),
    ]), [width - 222, 110, 112], [2]);
  }
  room(110);
  doc.moveDown(1);
  table(["Payment summary", "IDR"], [
    ["Invoice total", formatIDR(total)], ["Payments received", formatIDR(received)], ["Amount due", formatIDR(due)],
  ], [width - 160, 160], [1]);

  const noteHeight = doc.font("body").fontSize(7).heightOfString(INVOICE_LEGAL_NOTE, { width, lineGap: 2 });
  room(145 + noteHeight);
  const verifyY = doc.y + 18;
  doc.image(qr, 44, verifyY, { width: 100, height: 100 });
  doc.font("bold").fontSize(10).fillColor(ink).text("Verify this invoice", 160, verifyY + 10, { width: width - 116 });
  doc.font("body").fontSize(8).text("Scan to check the issued invoice and its current payment balance against ACTIVID’s record.", 160, doc.y + 6, { width: width - 116 });
  doc.fontSize(7).fillColor("#6b2737").text(verificationURL, 160, doc.y + 5, { width: width - 116, link: verificationURL, underline: true });
  doc.y = verifyY + 112;
  doc.x = 44;
  doc.font("body").fontSize(7).fillColor("#656575").text(INVOICE_LEGAL_NOTE, { width, lineGap: 2 });
  doc.moveDown(0.5).fontSize(7).text(`Snapshot generated ${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Makassar" }).format(new Date())} WITA. The verification page shows the latest record.`, { width });

  const range = doc.bufferedPageRange();
  for (let index = range.start; index < range.start + range.count; index += 1) {
    doc.switchToPage(index);
    doc.font("body").fontSize(7).fillColor("#656575").text(`${invoice.invoiceNumber}  |  ${index + 1} / ${range.count}`, 44, doc.page.height - 32, { width, height: 12, lineBreak: false });
  }
  doc.end();
  return completed;
}
