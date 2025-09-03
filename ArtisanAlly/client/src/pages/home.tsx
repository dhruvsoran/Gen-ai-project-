import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import FeaturedArtisans from '@/components/featured-artisans';
import AIStoryGenerator from '@/components/ai-story-generator';
import ProductShowcase from '@/components/product-showcase';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen" data-testid="home-page">
      <Navbar />
      <HeroSection />
      <FeaturedArtisans />
      <AIStoryGenerator />
      <ProductShowcase />
      <Footer />
    </div>
  );
}
