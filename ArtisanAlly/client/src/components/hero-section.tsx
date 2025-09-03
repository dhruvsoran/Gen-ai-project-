import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden" data-testid="hero-section">
      {/* Traditional craft pattern background */}
      <div className="absolute inset-0 opacity-5 craft-pattern" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">Empower</span> Traditional
                <br />
                <span className="font-serif italic">Artisans</span> with AI
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Bridge the gap between traditional craftsmanship and modern digital audiences. 
                Our AI-powered platform helps artisans tell their stories, showcase their work, 
                and reach customers worldwide.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/artisan-signup" data-testid="start-journey-button">
                <Button size="lg" className="px-8 py-3 font-medium">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/discover" data-testid="explore-crafts-button">
                <Button variant="outline" size="lg" className="px-8 py-3 font-medium">
                  Explore Crafts
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center" data-testid="stat-artisans">
                <div className="text-2xl font-bold text-primary">2000+</div>
                <div className="text-sm text-muted-foreground">Active Artisans</div>
              </div>
              <div className="text-center" data-testid="stat-crafts">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Traditional Crafts</div>
              </div>
              <div className="text-center" data-testid="stat-stories">
                <div className="text-2xl font-bold text-primary">15k+</div>
                <div className="text-sm text-muted-foreground">Stories Generated</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Traditional artisan working on pottery" 
              className="rounded-2xl shadow-2xl w-full h-auto"
              data-testid="hero-image"
            />
            
            {/* AI Assistant Card Overlay */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-lg max-w-xs" data-testid="ai-assistant-card">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Bot className="text-accent-foreground w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">AI Story Generator</div>
                  <div className="text-xs text-muted-foreground">Ready to help tell your story</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
