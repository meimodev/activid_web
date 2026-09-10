import BboldLogo from "./_components/BboldLogo";
import BboldFooter from "./_components/BboldFooter";
import BboldMasonryGrid from "./_components/BboldMasonryGrid";
import { availablePictures, bboldMasonryCards } from "./data";

export default function BboldPage() {
  return (
    <main className="min-h-screen bg-slate-800 px-4 pb-12">
      <div className="mx-auto max-w-lg text-stone-100">
        <BboldLogo compact />
        <BboldMasonryGrid
          cards={bboldMasonryCards}
          featuredCard={availablePictures}
        />
        <div className="pt-3 sm:pt-4">
          <BboldFooter />
        </div>
      </div>
    </main>
  );
}
