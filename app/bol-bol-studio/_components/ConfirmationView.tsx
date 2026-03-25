"use client";

import { useState } from "react";
import Strip from "./Strip";
import { formatLongDate, formatTime } from "../date";
import type { StudioInfo, StudioPackage } from "../config";

function formatPrice(price?: number) {
  if (!price) return "";
  return `Rp ${price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
}

export default function ConfirmationView({
  studioInfo,
  selectedDateTime,
  selectedPackage,
  onConfirmOrder,
}: {
  studioInfo: StudioInfo;
  selectedDateTime: Date;
  selectedPackage: StudioPackage | null;
  onConfirmOrder: (order: {
    name: string;
    phone: string;
    instagram: string;
    package: StudioPackage;
    dateTime: Date;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");

  return (
    <div className="w-full bg-blue-800 p-4 text-white">
      <div className="mb-4">
        <h2 className="text-2xl" style={{ fontFamily: "var(--font-studio-display)" }}>Konfirmasi Pemesanan</h2>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-white">Atas Nama</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded border border-white bg-blue-50 p-2 text-sm text-black"
            placeholder="Untuk mempermudah pencarian dan pengiriman foto"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-white">Nomor Handphone aktif</label>
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="rounded border border-white bg-blue-50 p-2 text-sm text-black"
            placeholder="Nomor HP WA / Telegram untuk pengiriman link foto"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-white">Instagram Handler</label>
          <input
            type="text"
            value={instagram}
            onChange={(event) => setInstagram(event.target.value)}
            className="rounded border border-white bg-blue-50 p-2 text-sm text-black"
            placeholder="Untuk Tag, Follow-Followan, Promosi & Diskon"
          />
        </div>
        <div className="flex justify-center overflow-clip">
          <Strip length={115} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-white">Rincian Pesanan</label>
          <div className="mx-6 flex flex-col rounded-3xl border border-blue-800 bg-white p-2 text-center text-sm text-blue-800" style={{ fontFamily: "var(--font-studio-body)" }}>
            {selectedPackage ? (
              <div className="flex flex-col">
                <label className="text-xl" style={{ fontFamily: "var(--font-studio-display)" }}>Paket {selectedPackage.name}</label>
                <div>{formatLongDate(selectedDateTime)}</div>
                <div>{`${formatTime(selectedDateTime)} ${studioInfo.timezoneLabel}`}</div>
                <div className="flex justify-center gap-1">
                  <p>{formatPrice(selectedPackage.price)}</p>
                  <p className="text-center text-amber-400" style={{ fontFamily: "var(--font-studio-display)" }}>*</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="pt-1 text-left text-xs text-blue-50">
            <div className="flex gap-1">
              <p className="font-bold">*</p>
              <p>Harga yang tertera hanya estimasi !</p>
            </div>
            <div className="flex gap-1">
              <p className="font-bold">*</p>
              <p>Harga final akan dikonfirmasi admin bol-bol studio</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center overflow-clip">
          <Strip length={115} />
        </div>
        <div className="py-4">
          <button
            type="button"
            onClick={() => {
              if (!selectedPackage) return;
              onConfirmOrder({
                name,
                phone,
                instagram,
                package: selectedPackage,
                dateTime: selectedDateTime,
              });
              setName("");
              setPhone("");
              setInstagram("");
            }}
            className="w-full rounded-xl border-2 bg-white px-4 py-2 text-blue-800 transition duration-200 hover:bg-blue-800 hover:text-white active:scale-[0.99]"
            style={{ fontFamily: "var(--font-studio-display)" }}
          >
            Konfirmasi Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}
