import Strip from "./Strip";
import { formatTime, fromMinutes } from "../date";
import type { StudioInfo } from "../config";

export default function HomeView({ studioInfo, onClickBooking }: { studioInfo: StudioInfo; onClickBooking: () => void }) {
  const openMinutes = studioInfo.openingHours.openMinutes;
  const closeMinutes = studioInfo.openingHours.closeMinutes;
  const timezoneLabel = studioInfo.timezoneLabel;
  const socials = studioInfo.socials;

  const openLabel = formatTime(fromMinutes(openMinutes));
  const closeLabel = formatTime(fromMinutes(closeMinutes));

  return (
    <div className="flex h-screen flex-col justify-center bg-blue-800 text-white">
      <div
        className="relative h-full w-full bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url(https://ik.imagekit.io/geb6bfhmhx/bol-bol-studio/main.jpg?updatedAt=1754041084936)" }}
      >
        <div className="absolute left-0 right-0 top-4 flex justify-center overflow-clip">
          <Strip length={115} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-800 via-blue-800 to-transparent text-center">
          <div className="pt-12 font-bold">
            <div className="text-5xl" style={{ fontFamily: "var(--font-studio-display)" }}>
              OPEN EVERYDAY!
            </div>
            <div className="flex justify-center gap-2 text-xl" style={{ fontFamily: "var(--font-studio-body)" }}>
              <span>{openLabel}</span>
              <span className="text-xs font-thin">{timezoneLabel}</span>
              <span>-</span>
              <span>{closeLabel}</span>
              <span className="text-xs font-thin">{timezoneLabel}</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-around gap-3 px-4 pb-4 pt-4 text-xs font-bold" style={{ fontFamily: "var(--font-studio-body)" }}>
            <a href={socials.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline-offset-4 hover:underline">
              Instagram {socials.instagramHandle}
            </a>
            <a href={socials.tiktokUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline-offset-4 hover:underline">
              TikTok {socials.tiktokHandle}
            </a>
            <a href={socials.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline-offset-4 hover:underline">
              Facebook {socials.facebookLabel}
            </a>
          </div>
          <button
            type="button"
            onClick={onClickBooking}
            className="mt-4 rounded-2xl bg-white px-8 py-4 text-blue-800 transition duration-200 active:scale-[0.99]"
            style={{ fontFamily: "var(--font-studio-display)" }}
          >
            Pesan Sekarang
          </button>
          <div className="my-4 flex justify-center overflow-clip">
            <Strip length={115} />
          </div>
        </div>
      </div>
    </div>
  );
}
