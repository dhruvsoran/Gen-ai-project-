import { type Artisan, type Product, type Story, type Inquiry, type InsertArtisan, type InsertProduct, type InsertStory, type InsertInquiry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Artisans
  getArtisan(id: string): Promise<Artisan | undefined>;
  getArtisanByEmail(email: string): Promise<Artisan | undefined>;
  createArtisan(artisan: InsertArtisan): Promise<Artisan>;
  updateArtisan(id: string, updates: Partial<Artisan>): Promise<Artisan | undefined>;
  getAllArtisans(): Promise<Artisan[]>;
  getFeaturedArtisans(): Promise<Artisan[]>;

  // Products
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByArtisan(artisanId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;

  // Stories
  createStory(story: InsertStory): Promise<Story>;
  getStoriesByArtisan(artisanId: string): Promise<Story[]>;

  // Inquiries
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiriesByArtisan(artisanId: string): Promise<Inquiry[]>;
}

export class MemStorage implements IStorage {
  private artisans: Map<string, Artisan>;
  private products: Map<string, Product>;
  private stories: Map<string, Story>;
  private inquiries: Map<string, Inquiry>;

  constructor() {
    this.artisans = new Map();
    this.products = new Map();
    this.stories = new Map();
    this.inquiries = new Map();
  }

  // Artisans
  async getArtisan(id: string): Promise<Artisan | undefined> {
    return this.artisans.get(id);
  }

  async getArtisanByEmail(email: string): Promise<Artisan | undefined> {
    return Array.from(this.artisans.values()).find(artisan => artisan.email === email);
  }

  async createArtisan(insertArtisan: InsertArtisan): Promise<Artisan> {
    const id = randomUUID();
    const artisan: Artisan = {
      ...insertArtisan,
      id,
      rating: 5,
      reviewCount: 0,
      isActive: 1,
      aiGeneratedStory: null,
      createdAt: new Date(),
      location: insertArtisan.location || null,
      portfolioImages: insertArtisan.portfolioImages || [],
    };
    this.artisans.set(id, artisan);
    return artisan;
  }

  async updateArtisan(id: string, updates: Partial<Artisan>): Promise<Artisan | undefined> {
    const artisan = this.artisans.get(id);
    if (!artisan) return undefined;
    
    const updatedArtisan = { ...artisan, ...updates };
    this.artisans.set(id, updatedArtisan);
    return updatedArtisan;
  }

  async getAllArtisans(): Promise<Artisan[]> {
    return Array.from(this.artisans.values()).filter(artisan => artisan.isActive === 1);
  }

  async getFeaturedArtisans(): Promise<Artisan[]> {
    const allArtisans = await this.getAllArtisans();
    return allArtisans.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
  }

  // Products
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByArtisan(artisanId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => 
      product.artisanId === artisanId && product.isAvailable === 1
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      isAvailable: 1,
      aiGeneratedDescription: null,
      createdAt: new Date(),
      images: insertProduct.images || [],
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.isAvailable === 1);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => 
      product.category === category && product.isAvailable === 1
    );
  }

  // Stories
  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = randomUUID();
    const story: Story = {
      ...insertStory,
      id,
      generatedStory: "",
      createdAt: new Date(),
    };
    this.stories.set(id, story);
    return story;
  }

  async getStoriesByArtisan(artisanId: string): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => story.artisanId === artisanId);
  }

  // Inquiries
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = randomUUID();
    const inquiry: Inquiry = {
      ...insertInquiry,
      id,
      status: "pending",
      createdAt: new Date(),
      productId: insertInquiry.productId || null,
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getInquiriesByArtisan(artisanId: string): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(inquiry => inquiry.artisanId === artisanId);
  }
}

export const storage = new MemStorage();
