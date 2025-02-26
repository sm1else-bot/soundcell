import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SamplePack } from "@shared/schema";

export default function Checkout() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const { data: pack, isLoading } = useQuery<SamplePack>({
    queryKey: [`/api/packs/${id}`],
  });

  const checkout = useMutation({
    mutationFn: async () => {
      setProcessing(true);
      const res = await apiRequest("POST", "/api/checkout", { packId: id });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your purchase was successful. Check your email for download links.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong with the payment.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setProcessing(false);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!pack) {
    return <div>Pack not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-16">
      <div className="container mx-auto px-4 max-w-lg">
        <Card className="bg-black/50 border-cyan-500/20">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-cyan-400 mb-6">Checkout</h1>
            
            <div className="mb-6">
              <h2 className="text-xl mb-2">{pack.title}</h2>
              <p className="text-gray-400">{pack.description}</p>
              <p className="text-xl font-bold text-magenta-500 mt-2">
                ${(pack.price / 100).toFixed(2)}
              </p>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full bg-cyan-500 hover:bg-cyan-600"
                onClick={() => checkout.mutate()}
                disabled={processing}
              >
                {processing ? "Processing..." : "Complete Purchase"}
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation("/")}
                disabled={processing}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
