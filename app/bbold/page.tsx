import AutoGallery from "./_components/AutoGallery";
import BboldLogo from "./_components/BboldLogo";
import { landingSections } from "./data";

export default function BboldPage() {
  return (
    <main className="min-h-screen bg-slate-800 px-4 pb-12">
      <div className="mx-auto max-w-lg text-stone-100">
        <BboldLogo />
        <div className="space-y-0">
          <div className="h-8" />
          {landingSections.map((section, sectionIndex) => (
            <div
              key={`${section.heightClassName}-${sectionIndex}`}
              className={`${section.heightClassName} ${section.containerClassName ?? ""} flex`}
            >
              {section.groups.map((group) => (
                <div key={`${group.label}-${group.images[0]}`} className="h-full flex-1">
                  <AutoGallery group={group} delay={sectionIndex === landingSections.length - 1 ? 1400 : 2400} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
