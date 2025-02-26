import { samplePacks, type SamplePack, type InsertSamplePack } from "@shared/schema";

export interface IStorage {
  getSamplePacks(): Promise<SamplePack[]>;
  getSamplePack(id: number): Promise<SamplePack | undefined>;
  getFeaturedPack(): Promise<SamplePack | undefined>;
  createSamplePack(pack: InsertSamplePack): Promise<SamplePack>;
  updateSamplePack(id: number, pack: InsertSamplePack): Promise<SamplePack>;
}

export class MemStorage implements IStorage {
  private packs: Map<number, SamplePack>;
  private currentId: number;

  constructor() {
    this.packs = new Map();
    this.currentId = 1;
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const samplePacks: InsertSamplePack[] = [
      {
        title: "Neon Nights",
        description: "Cyberpunk-inspired synth leads and atmospheric pads",
        price: 2999,
        imageUrl: "https://images.unsplash.com/photo-1475275166152-f1e8005f9854",
        demoUrl: "https://soundcloud.com/example/neon-nights",
        featured: 1
      },
      {
        title: "Digital Dreams",
        description: "Future bass essentials with glitch percussion",
        price: 1999,
        imageUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73",
        demoUrl: "https://soundcloud.com/example/digital-dreams",
        featured: 0
      },
      {
        title: "Neural Network",
        description: "AI-generated soundscapes and textures",
        price: 2499,
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        demoUrl: "https://soundcloud.com/example/neural-network",
        featured: 0
      }
    ];

    samplePacks.forEach(pack => {
      this.createSamplePack(pack);
    });
  }

  async getSamplePacks(): Promise<SamplePack[]> {
    return Array.from(this.packs.values());
  }

  async getSamplePack(id: number): Promise<SamplePack | undefined> {
    return this.packs.get(id);
  }

  async getFeaturedPack(): Promise<SamplePack | undefined> {
    return Array.from(this.packs.values()).find(pack => pack.featured === 1);
  }

  async createSamplePack(pack: InsertSamplePack): Promise<SamplePack> {
    const id = this.currentId++;
    const newPack: SamplePack = { ...pack, id };
    this.packs.set(id, newPack);
    return newPack;
  }

  async updateSamplePack(id: number, pack: InsertSamplePack): Promise<SamplePack> {
    const updatedPack: SamplePack = { ...pack, id };
    this.packs.set(id, updatedPack);
    return updatedPack;
  }
}

export const storage = new MemStorage();