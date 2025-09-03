import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const artisans = pgTable("artisans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  craftSpecialty: text("craft_specialty").notNull(),
  yearsOfExperience: text("years_of_experience").notNull(),
  biography: text("biography").notNull(),
  location: text("location"),
  portfolioImages: text("portfolio_images").array().default([]),
  aiGeneratedStory: text("ai_generated_story"),
  rating: integer("rating").default(5),
  reviewCount: integer("review_count").default(0),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  artisanId: varchar("artisan_id").notNull().references(() => artisans.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // price in paise/cents
  category: text("category").notNull(),
  images: text("images").array().default([]),
  aiGeneratedDescription: text("ai_generated_description"),
  isAvailable: integer("is_available").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  artisanId: varchar("artisan_id").notNull().references(() => artisans.id),
  userInput: text("user_input").notNull(),
  generatedStory: text("generated_story").notNull(),
  craftType: text("craft_type").notNull(),
  experience: text("experience").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  artisanId: varchar("artisan_id").notNull().references(() => artisans.id),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  message: text("message").notNull(),
  productId: varchar("product_id").references(() => products.id),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertArtisanSchema = createInsertSchema(artisans).omit({
  id: true,
  createdAt: true,
  aiGeneratedStory: true,
  rating: true,
  reviewCount: true,
  isActive: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  aiGeneratedDescription: true,
  isAvailable: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
  generatedStory: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Types
export type Artisan = typeof artisans.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Story = typeof stories.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;

export type InsertArtisan = z.infer<typeof insertArtisanSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
