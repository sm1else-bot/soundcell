import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SamplePack, InsertSamplePack } from "@shared/schema";
import { GlitchText } from "@/components/glitch-text";

export default function Admin() {
  const { toast } = useToast();
  const [editingPack, setEditingPack] = useState<SamplePack | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: packs, isLoading } = useQuery<SamplePack[]>({
    queryKey: ["/api/packs"],
  });

  const updatePack = useMutation({
    mutationFn: async (pack: SamplePack) => {
      const res = await apiRequest("PUT", `/api/packs/${pack.id}`, pack);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packs"] });
      toast({ title: "Success", description: "Pack updated successfully" });
      setEditingPack(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update pack",
        variant: "destructive",
      });
    },
  });

  const createPack = useMutation({
    mutationFn: async (pack: InsertSamplePack) => {
      const res = await apiRequest("POST", "/api/packs", pack);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packs"] });
      toast({ title: "Success", description: "Pack created successfully" });
      setEditingPack(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create pack",
        variant: "destructive",
      });
    },
  });

  const hashPassword = (str: string) => {
    // Simple but effective hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hashedInput = hashPassword(password);
    const hashedStored = hashPassword("St0r3_B055");
    if (hashedInput === hashedStored) {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <GlitchText 
            text="ADMIN ACCESS" 
            className="text-4xl md:text-6xl font-bold mb-8"
          />
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-64 bg-transparent border-cyan-500"
            />
            <Button type="submit" className="w-64 bg-cyan-500 hover:bg-cyan-600">
              Enter
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">Admin Dashboard</h1>
          <Button
            onClick={() => setEditingPack({ id: 0, title: "", description: "", price: 0, imageUrl: "", demoUrl: "", featured: 0 })}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            Create New Pack
          </Button>
        </div>

        {editingPack && (
          <div className="mb-8 bg-black/50 p-6 rounded-lg border border-cyan-500/20">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              {editingPack.id === 0 ? "Create New Pack" : "Edit Pack"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const pack = {
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  price: Number(formData.get("price")),
                  imageUrl: formData.get("imageUrl") as string,
                  demoUrl: formData.get("demoUrl") as string,
                  featured: Number(formData.get("featured")),
                };

                if (editingPack.id === 0) {
                  createPack.mutate(pack);
                } else {
                  updatePack.mutate({ ...pack, id: editingPack.id });
                }
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingPack.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingPack.description}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (in cents)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={editingPack.price}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingPack.imageUrl}
                  required
                />
              </div>
              <div>
                <Label htmlFor="demoUrl">Demo URL (SoundCloud)</Label>
                <Input
                  id="demoUrl"
                  name="demoUrl"
                  defaultValue={editingPack.demoUrl}
                  required
                />
              </div>
              <div>
                <Label htmlFor="featured">Featured (0 or 1)</Label>
                <Input
                  id="featured"
                  name="featured"
                  type="number"
                  min="0"
                  max="1"
                  defaultValue={editingPack.featured}
                  required
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                  {editingPack.id === 0 ? "Create" : "Update"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPack(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-black/50 rounded-lg border border-cyan-500/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/20">
                  <th className="p-4 text-left text-cyan-400">Title</th>
                  <th className="p-4 text-left text-cyan-400">Description</th>
                  <th className="p-4 text-left text-cyan-400">Price</th>
                  <th className="p-4 text-left text-cyan-400">Featured</th>
                  <th className="p-4 text-left text-cyan-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packs?.map((pack) => (
                  <tr key={pack.id} className="border-b border-cyan-500/20">
                    <td className="p-4">{pack.title}</td>
                    <td className="p-4">{pack.description}</td>
                    <td className="p-4">${(pack.price / 100).toFixed(2)}</td>
                    <td className="p-4">{pack.featured ? "Yes" : "No"}</td>
                    <td className="p-4">
                      <Button
                        onClick={() => setEditingPack(pack)}
                        className="bg-cyan-500 hover:bg-cyan-600"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}