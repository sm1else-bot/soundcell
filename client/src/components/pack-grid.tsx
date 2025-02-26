import { PackCard } from "./pack-card";
import type { SamplePack } from "@shared/schema";

interface PackGridProps {
  packs: SamplePack[];
}

export function PackGrid({ packs }: PackGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
      {packs.map((pack) => (
        <div key={pack.id} className="h-full">
          <PackCard pack={pack} />
        </div>
      ))}
    </div>
  );
}