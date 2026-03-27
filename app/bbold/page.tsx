import AutoGallery from "./_components/AutoGallery";
import BboldLogo from "./_components/BboldLogo";
import BboldFooter from "./_components/BboldFooter";
import { landingSections } from "./data";

function getGalleryDelay(sectionIndex: number, groupIndex: number, isLastSection: boolean): number {
  const baseDelay = isLastSection ? 1700 : 2600;
  return baseDelay + sectionIndex * 190 + groupIndex * 430;
}

export default function BboldPage() {
  let revealOrder = 0;

  const sectionsWithRevealDelay = landingSections.map((section) => ({
    ...section,
    groups: section.groups.map((group) => ({
      group,
      revealDelay: revealOrder++ * 0.16,
    })),
  }));

  return (
    <main className="min-h-screen bg-slate-800 px-4 pb-12">
      <div className="mx-auto max-w-lg text-stone-100">
        <BboldLogo compact />
        <div className="space-y-0">
          <div className="h-8" />
          {sectionsWithRevealDelay.map((section, sectionIndex) => (
            <div
              key={`${section.heightClassName}-${sectionIndex}`}
              className={`${section.heightClassName} ${section.containerClassName ?? ""} flex`}
            >
              {section.groups.map(({ group, revealDelay }, groupIndex) => (
                <div key={`${group.label}-${group.images[0]}`} className="h-full flex-1">
                  <AutoGallery
                    group={group}
                    delay={getGalleryDelay(sectionIndex, groupIndex, sectionIndex === sectionsWithRevealDelay.length - 1)}
                    revealDelay={revealDelay}
                  />
                </div>
              ))}
            </div>
          ))}

          <BboldFooter />
        </div>
      </div>
    </main>
  );
}
