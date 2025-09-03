import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArtisanSchema, insertProductSchema, insertStorySchema, insertInquirySchema } from "@shared/schema";
import { generateStory, analyzeProduct } from "./services/gemini";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Artisan routes
  app.get("/api/artisans", async (req, res) => {
    try {
      const artisans = await storage.getAllArtisans();
      res.json(artisans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artisans" });
    }
  });

  app.get("/api/artisans/featured", async (req, res) => {
    try {
      const featuredArtisans = await storage.getFeaturedArtisans();
      res.json(featuredArtisans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured artisans" });
    }
  });

  app.get("/api/artisans/:id", async (req, res) => {
    try {
      const artisan = await storage.getArtisan(req.params.id);
      if (!artisan) {
        return res.status(404).json({ message: "Artisan not found" });
      }
      res.json(artisan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artisan" });
    }
  });

  app.post("/api/artisans", upload.array('portfolioImages', 10), async (req, res) => {
    try {
      const validatedData = insertArtisanSchema.parse(req.body);
      
      // Handle uploaded files
      const portfolioImages: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const fileName = `${Date.now()}-${file.originalname}`;
          const filePath = path.join(uploadDir, fileName);
          fs.renameSync(file.path, filePath);
          portfolioImages.push(`/uploads/${fileName}`);
        }
      }

      const artisanData = {
        ...validatedData,
        portfolioImages,
      };

      const artisan = await storage.createArtisan(artisanData);
      res.status(201).json(artisan);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create artisan" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && typeof category === 'string') {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getAllProducts();
      }

      // Join with artisan data
      const productsWithArtisans = await Promise.all(
        products.map(async (product) => {
          const artisan = await storage.getArtisan(product.artisanId);
          return {
            ...product,
            artisan: artisan ? {
              id: artisan.id,
              firstName: artisan.firstName,
              lastName: artisan.lastName,
              location: artisan.location,
            } : null
          };
        })
      );

      res.json(productsWithArtisans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/artisans/:artisanId/products", async (req, res) => {
    try {
      const products = await storage.getProductsByArtisan(req.params.artisanId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artisan products" });
    }
  });

  app.post("/api/products", upload.array('images', 5), async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      // Handle uploaded files
      const images: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const fileName = `${Date.now()}-${file.originalname}`;
          const filePath = path.join(uploadDir, fileName);
          fs.renameSync(file.path, filePath);
          images.push(`/uploads/${fileName}`);
        }
      }

      const productData = {
        ...validatedData,
        images,
      };

      let product = await storage.createProduct(productData);

      // Generate AI description and update product
      try {
        const aiDescription = await analyzeProduct(productData.name, productData.description, productData.category);
        product = await storage.updateProduct(product.id, { aiGeneratedDescription: aiDescription }) || product;
      } catch (aiError) {
        console.error('Failed to generate AI description:', aiError);
      }

      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create product" });
    }
  });

  // Story generation
  app.post("/api/stories/generate", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      
      // Generate story using AI
      const generatedStory = await generateStory(
        validatedData.userInput,
        validatedData.craftType,
        validatedData.experience
      );

      const story = await storage.createStory(validatedData);
      
      // Update story with generated content
      const updatedStory = {
        ...story,
        generatedStory,
      };

      res.json({ story: generatedStory, id: updatedStory.id });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to generate story" });
    }
  });

  app.get("/api/artisans/:artisanId/stories", async (req, res) => {
    try {
      const stories = await storage.getStoriesByArtisan(req.params.artisanId);
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  // Inquiry routes
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create inquiry" });
    }
  });

  app.get("/api/artisans/:artisanId/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getInquiriesByArtisan(req.params.artisanId);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const searchTerm = q.toLowerCase();
      const artisans = await storage.getAllArtisans();
      const products = await storage.getAllProducts();

      const matchedArtisans = artisans.filter(artisan => 
        artisan.firstName.toLowerCase().includes(searchTerm) ||
        artisan.lastName.toLowerCase().includes(searchTerm) ||
        artisan.craftSpecialty.toLowerCase().includes(searchTerm) ||
        artisan.biography.toLowerCase().includes(searchTerm) ||
        (artisan.location && artisan.location.toLowerCase().includes(searchTerm))
      );

      const matchedProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );

      res.json({
        artisans: matchedArtisans,
        products: matchedProducts,
      });
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
