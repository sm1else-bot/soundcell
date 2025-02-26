import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/hero";
import { PackGrid } from "@/components/pack-grid";
import type { SamplePack } from "@shared/schema";

export default function Home() {
  const { data: featuredPack, isLoading: loadingFeatured } = useQuery<SamplePack>({
    queryKey: ["/api/packs/featured"],
  });

  const { data: packs, isLoading: loadingPacks } = useQuery<SamplePack[]>({
    queryKey: ["/api/packs"],
  });

  if (loadingFeatured || loadingPacks) {
    return <div>Loading...</div>;
  }

  if (!featuredPack || !packs) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <header className="absolute top-0 right-0 p-4 z-10">
        <span className="text-cyan-400 font-bold">TLW/UI</span>
      </header>

      <main className="flex-grow">
        <Hero pack={featuredPack} />
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-cyan-400 mb-8">Browse Packs</h2>
          <PackGrid packs={packs} />
        </div>
      </main>

      <footer className="text-center py-6 text-gray-400 border-t border-cyan-500/20">
        2025 All Rights Reserved, Wunderkind Media (on behalf of Jessenth Ebenezer)
      </footer>
    </div>
  );
}