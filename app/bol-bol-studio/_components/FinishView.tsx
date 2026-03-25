"use client";

export default function FinishView({ onFinishOrder }: { onFinishOrder: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-800 text-white">
      <div className="w-full max-w-sm rounded-3xl border-2 border-blue-800 bg-white p-8 text-center text-blue-800 shadow-lg">
        <h2 className="mb-4 text-3xl" style={{ fontFamily: "var(--font-studio-display)" }}>Thank You</h2>
        <p className="mb-4 text-sm" style={{ fontFamily: "var(--font-studio-body)" }}>
          Pesanan anda telah diterima, anda akan dihubungi admin kami yaaa.
        </p>
        <button
          type="button"
          onClick={onFinishOrder}
          className="mt-4 rounded-xl border-2 border-blue-800 bg-blue-800 px-6 py-2 text-white transition duration-200 hover:bg-white hover:text-blue-800 active:scale-[0.99]"
          style={{ fontFamily: "var(--font-studio-display)" }}
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
