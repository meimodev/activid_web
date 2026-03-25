"use client";

import Strip from "./Strip";
import type { StudioInfo, StudioPackage } from "../config";

function formatPrice(price: number) {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)} K`;
  }
  return `${price}`;
}

export default function PackageView({
  studioInfo,
  onSelectPackage,
}: {
  studioInfo: StudioInfo;
  onSelectPackage: (value: StudioPackage) => void;
}) {
  return (
    <div className="bg-blue-800 p-4 text-white">
      <div className="my-4 flex items-center justify-between gap-6 overflow-clip">
        <div className="w-full">
          <h2 className="text-2xl" style={{ fontFamily: "var(--font-studio-display)" }}>Pilih Paket</h2>
        </div>
        <div className="overflow-clip">
          <Strip length={41} />
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded">
        {studioInfo.packages.map((pkg) => (
          <button
            key={pkg.id ?? pkg.name}
            type="button"
            onClick={() => onSelectPackage(pkg)}
            className="rounded-xl border-2 border-white p-4 text-left transition duration-200 hover:bg-white hover:text-blue-800 focus:border-amber-400 focus:bg-white focus:text-blue-800 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-[5rem]" style={{ fontFamily: "var(--font-studio-display)" }}>
                {pkg.name.toUpperCase()}
              </div>
              <div className="flex flex-grow flex-col text-xs" style={{ fontFamily: "var(--font-studio-body)" }}>
                <div>
                  <span className="font-bold">{pkg.duration} Menit </span>sesi foto
                </div>
                <div>
                  maximal <span className="font-bold">{pkg.capacity} orang</span>
                </div>
                {pkg.notes?.length ? (
                  <div className="text-xs">
                    {pkg.notes.map((note) => (
                      <div key={note}>{note}</div>
                    ))}
                  </div>
                ) : null}
              </div>
              <h4 className="text-2xl" style={{ fontFamily: "var(--font-studio-display)" }}>
                {formatPrice(pkg.price)}
              </h4>
            </div>
          </button>
        ))}
      </div>
      <div className="my-4 flex items-center justify-between gap-6 overflow-clip">
        <div className="w-full">
          <h2 className="text-2xl" style={{ fontFamily: "var(--font-studio-display)" }}>TAMBAHAN</h2>
        </div>
        <div className="overflow-clip">
          <Strip length={41} />
        </div>
      </div>
      <div className="mb-8 grid grid-cols-2 gap-4">
        {studioInfo.addsOn.map((addOn, index) => (
          <div key={`${addOn.title}-${index}`} className="rounded-lg bg-white p-4 text-blue-800 transition duration-200 hover:scale-[0.99]">
            <div className="flex items-center gap-4" style={{ fontFamily: "var(--font-studio-body)" }}>
              <div className="flex-grow text-xs">{addOn.title}</div>
              <div className="min-w-12 text-md font-bold" style={{ fontFamily: "var(--font-studio-display)" }}>
                {formatPrice(addOn.price)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
