import { GlitchText } from "./glitch-text";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { SamplePack } from "@shared/schema";

interface HeroProps {
  pack: SamplePack;
}

export function Hero({ pack }: HeroProps) {
  return (
    <div className="relative h-[70vh] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={pack.imageUrl}
          alt={pack.title}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
      </div>
      
      <div className="relative container mx-auto px-4">
        <GlitchText
          text="SOUNDCELL"
          className="text-6xl md:text-8xl font-bold mb-4"
        />
        <h2 className="text-2xl md:text-4xl text-cyan-400 mb-6">
          Featured: {pack.title}
        </h2>
        <p className="text-gray-300 max-w-xl mb-8">{pack.description}</p>
        <Link href={`/pack/${pack.id}`}>
          <Button className="bg-magenta-500 hover:bg-magenta-600 text-lg px-8 py-6">
            Explore Pack
          </Button>
        </Link>
      </div>
    </div>
  );
}
