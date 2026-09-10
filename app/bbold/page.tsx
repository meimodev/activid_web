import AutoGallery from "./_components/AutoGallery";
import BboldLogo from "./_components/BboldLogo";
import BboldFooter from "./_components/BboldFooter";
import BboldMasonryGrid from "./_components/BboldMasonryGrid";
import { availablePictures, bboldMasonryCards } from "./data";

export default function BboldPage() {
  return (
    <main className="min-h-screen bg-[#d4c3b0] px-4 pb-12 text-[#241a15]">
      <div className="mx-auto max-w-lg">
        <BboldLogo compact />
        <BboldMasonryGrid cards={bboldMasonryCards} />
        <div className="pt-3 sm:pt-4">
          <div
            className="w-full aspect-[720/1309] min-w-0"
            style={{ aspectRatio: "720 / 1309" }}
          >
            <AutoGallery
              group={availablePictures}
              delay={2400}
              revealDelay={bboldMasonryCards.length * 0.08}
            />
          </div>
        </div>
        <div className="pt-3 sm:pt-4">
          <BboldFooter />
        </div>
      </div>
    </main>
  );
}
