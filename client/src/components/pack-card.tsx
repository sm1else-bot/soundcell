import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { SamplePack } from "@shared/schema";

interface PackCardProps {
  pack: SamplePack;
}

export function PackCard({ pack }: PackCardProps) {
  return (
    <Card className="h-full bg-black/50 border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
      <div className="flex flex-col h-full">
        <CardContent className="p-0 flex-none">
          <div className="relative pt-[100%]">
            <img
              src={pack.imageUrl}
              alt={pack.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-cyan-400 line-clamp-1">{pack.title}</h3>
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{pack.description}</p>
            <p className="text-lg font-bold text-magenta-500 mt-2">
              ${(pack.price / 100).toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          <Link href={`/pack/${pack.id}`} className="w-full">
            <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
              View Pack
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}