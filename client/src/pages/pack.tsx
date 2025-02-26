import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { SamplePack } from "@shared/schema";

export default function Pack() {
  const { id } = useParams();
  
  const { data: pack, isLoading } = useQuery<SamplePack>({
    queryKey: [`/api/packs/${id}`],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!pack) {
    return <div>Pack not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={pack.imageUrl}
              alt={pack.title}
              className="w-full rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-cyan-400 mb-4">{pack.title}</h1>
            <p className="text-gray-300 mb-6">{pack.description}</p>
            <div className="mb-8">
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                src={pack.demoUrl}
              ></iframe>
            </div>
            <p className="text-2xl font-bold text-magenta-500 mb-6">
              ${(pack.price / 100).toFixed(2)}
            </p>
            <Link href={`/checkout/${pack.id}`}>
              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-lg py-6">
                Buy Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
