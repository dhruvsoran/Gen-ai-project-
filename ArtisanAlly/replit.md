# Overview

Artisan Connect is a marketplace platform that bridges traditional Indian artisans with global digital audiences. The application combines an Express.js backend with a React frontend to create a comprehensive platform where artisans can showcase their crafts, tell their stories through AI-generated narratives, and connect with potential customers. The platform emphasizes cultural heritage preservation while modernizing the artisan marketplace experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React 18 using TypeScript and follows a component-based architecture. The application uses shadcn/ui components built on Radix UI primitives for a consistent design system. State management is handled through TanStack Query for server state and React's built-in hooks for local state. The routing system uses Wouter for client-side navigation, providing a lightweight alternative to React Router.

The UI layer implements a warm, craftsman-inspired design system with earth tones and traditional typography. The component structure separates UI primitives (buttons, cards, forms) from business components (artisan profiles, product showcases). The styling approach uses Tailwind CSS with CSS custom properties for theming, allowing for consistent color schemes and spacing throughout the application.

## Backend Architecture
The server follows a RESTful API design pattern using Express.js with TypeScript. The architecture separates concerns through distinct layers: route handlers for HTTP logic, a storage abstraction layer for data persistence, and service modules for business logic. The API provides endpoints for artisan management, product catalog operations, story generation, and customer inquiries.

The application includes a flexible storage interface that currently uses in-memory storage for development but is designed to easily swap to database implementations. Error handling is centralized through Express middleware, providing consistent error responses across all endpoints.

## Database Schema Design
The data model centers around four main entities: artisans, products, stories, and inquiries. Artisans serve as the core entity, with products and stories linked through foreign key relationships. The schema supports rich media through array fields for portfolio images and product photos. AI-generated content is stored alongside user-provided data, enabling hybrid content strategies.

The schema uses PostgreSQL-compatible types through Drizzle ORM, supporting UUID primary keys, text arrays for image collections, and timestamp tracking for audit trails. The design accommodates both structured data (names, categories, prices) and unstructured content (biographies, descriptions, stories).

## AI Integration Architecture
The platform integrates Google's Gemini AI for content generation through dedicated service modules. The AI system supports two primary use cases: story generation for artisan profiles and product description enhancement. The AI services use carefully crafted prompts that emphasize cultural authenticity and traditional craftsmanship values.

The AI integration follows a service-oriented approach, isolating AI functionality from business logic and providing error handling for API failures. Generated content is stored alongside user input, allowing for comparison and potential regeneration while maintaining data integrity.

## File Upload System
The application implements file upload capabilities using Multer middleware for handling multipart form data. The upload system supports image files with size restrictions and type validation. Files are stored locally with plans for cloud storage integration. The system generates unique identifiers for uploaded files and maintains associations with artisan profiles and product listings.

## Development and Build Pipeline
The development environment uses Vite for fast frontend development with Hot Module Replacement. The build process separates client and server builds, with ESBuild handling server-side bundling for production deployment. The TypeScript configuration supports path mapping for clean imports and includes shared type definitions between frontend and backend.

The development setup includes Replit-specific optimizations for cloud development environments, including error overlays and development banners for external access scenarios.

# External Dependencies

## Core Framework Dependencies
- **Express.js**: Backend web framework providing HTTP server capabilities and middleware support
- **React 18**: Frontend framework for building the user interface with modern features like concurrent rendering
- **Vite**: Build tool and development server providing fast development experience and optimized production builds
- **TypeScript**: Type system providing compile-time error checking and enhanced developer experience

## Database and ORM
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL interaction and schema management
- **@neondatabase/serverless**: PostgreSQL driver optimized for serverless environments
- **Drizzle Kit**: Database schema migration and management tools

## AI and Content Generation
- **@google/genai**: Google Gemini AI SDK for content generation capabilities including story creation and product description enhancement

## UI Framework and Components
- **Radix UI**: Unstyled, accessible UI primitives including dialogs, dropdowns, forms, and navigation components
- **shadcn/ui**: Pre-styled component library built on Radix UI with consistent design patterns
- **Tailwind CSS**: Utility-first CSS framework for styling with custom design system integration
- **Lucide React**: Icon library providing consistent iconography throughout the application

## Form and Data Management
- **React Hook Form**: Form library for handling form state, validation, and submission
- **@hookform/resolvers**: Validation resolvers connecting React Hook Form with schema validation
- **Zod**: Schema validation library for type-safe data validation on both client and server
- **TanStack Query**: Server state management library handling API calls, caching, and synchronization

## File Upload and Processing
- **Multer**: Middleware for handling multipart/form-data and file uploads
- **@types/multer**: TypeScript definitions for Multer integration

## Routing and Navigation
- **Wouter**: Lightweight client-side routing library providing navigation capabilities without the overhead of React Router

## Development and Tooling
- **@replit/vite-plugin-runtime-error-modal**: Development plugin for enhanced error reporting in Replit environment
- **@replit/vite-plugin-cartographer**: Development tool for project visualization and navigation
- **PostCSS**: CSS processing tool with Autoprefixer for vendor prefix management

## Session and Authentication Infrastructure
- **connect-pg-simple**: PostgreSQL session store for Express sessions, supporting user authentication and session management
- **Express Session**: Session middleware for maintaining user state across requests

## Utility Libraries
- **date-fns**: Date manipulation library for formatting and date operations
- **clsx**: Utility for conditional CSS class name construction
- **class-variance-authority**: Utility for creating component variants with consistent styling patterns
- **nanoid**: Unique ID generation for creating identifiers