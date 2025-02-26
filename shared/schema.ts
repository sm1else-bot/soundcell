import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const samplePacks = pgTable("sample_packs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  demoUrl: text("demo_url").notNull(),
  featured: integer("featured").default(0),
});

export const insertSamplePackSchema = createInsertSchema(samplePacks).omit({ 
  id: true 
});

export type InsertSamplePack = z.infer<typeof insertSamplePackSchema>;
export type SamplePack = typeof samplePacks.$inferSelect;
