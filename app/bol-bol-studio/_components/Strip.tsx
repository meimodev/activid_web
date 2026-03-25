export default function Strip({ length, invert = false }: { length: number; invert?: boolean }) {
  return (
    <div className="inline-grid grid-flow-col grid-rows-3">
      {Array.from({ length }).map((_, index) => {
        const isLight = index % 2 === 0;
        const color = invert ? (isLight ? "bg-blue-800" : "bg-white") : isLight ? "bg-white" : "bg-blue-800";
        return <div key={index} className={`h-4 w-4 ${color}`} />;
      })}
    </div>
  );
}
