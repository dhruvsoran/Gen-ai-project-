import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MapPin, Calendar, Mail, Phone, Heart } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import type { Artisan, Product } from '@shared/schema';

export default function ArtisanProfile() {
  const [match, params] = useRoute('/artisan/:id');
  const artisanId = params?.id;

  const { data: artisan, isLoading: artisanLoading } = useQuery<Artisan>({
    queryKey: ['/api/artisans', artisanId],
    enabled: !!artisanId,
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/artisans', artisanId, 'products'],
    enabled: !!artisanId,
  });

  if (!match) {
    return <div>Invalid artisan profile</div>;
  }

  if (artisanLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="artisan-profile-loading">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-8 w-48 mx-auto mb-2" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-8 w-32" />
                <div className="grid sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="w-full h-48" />
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2 mb-3" />
                        <Skeleton className="h-4 w-16" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-background" data-testid="artisan-not-found">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Artisan Not Found</h1>
          <p className="text-muted-foreground">The artisan profile you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="artisan-profile-page">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Artisan Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24" data-testid="artisan-info-card">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {artisan.portfolioImages?.[0] ? (
                      <img
                        src={artisan.portfolioImages[0]}
                        alt={`${artisan.firstName} ${artisan.lastName}`}
                        className="w-32 h-32 rounded-full object-cover"
                        data-testid="artisan-avatar"
                      />
                    ) : (
                      <span className="text-4xl font-semibold text-primary" data-testid="artisan-initials">
                        {artisan.firstName[0]}{artisan.lastName[0]}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold mb-2" data-testid="artisan-name">
                    {artisan.firstName} {artisan.lastName}
                  </h1>
                  <Badge variant="secondary" className="mb-4" data-testid="artisan-craft">
                    {artisan.craftSpecialty}
                  </Badge>
                  
                  <div className="flex items-center justify-center space-x-1 mb-4" data-testid="artisan-rating">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-medium">{artisan.rating || 5.0}</span>
                    <span className="text-muted-foreground">({artisan.reviewCount || 0} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {artisan.location && (
                    <div className="flex items-center space-x-2" data-testid="artisan-location">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{artisan.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2" data-testid="artisan-experience">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{artisan.yearsOfExperience} years of experience</span>
                  </div>

                  <div className="flex items-center space-x-2" data-testid="artisan-email">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{artisan.email}</span>
                  </div>

                  {artisan.phone && (
                    <div className="flex items-center space-x-2" data-testid="artisan-phone">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{artisan.phone}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <Button className="w-full" data-testid="contact-artisan-button">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Artisan
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="follow-artisan-button">
                    <Heart className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* About Section */}
              <section data-testid="about-section">
                <h2 className="text-2xl font-bold mb-4">About {artisan.firstName}</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed" data-testid="artisan-biography">
                    {artisan.biography}
                  </p>
                </div>
                
                {artisan.aiGeneratedStory && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg border-l-4 border-l-primary" data-testid="ai-generated-story">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="text-primary w-4 h-4" />
                      <span className="text-sm font-medium text-primary">AI Generated Story</span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {artisan.aiGeneratedStory}
                    </p>
                  </div>
                )}
              </section>

              {/* Portfolio Gallery */}
              {artisan.portfolioImages && artisan.portfolioImages.length > 1 && (
                <section data-testid="portfolio-section">
                  <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {artisan.portfolioImages.slice(1).map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden" data-testid={`portfolio-image-${index}`}>
                        <img
                          src={image}
                          alt={`Portfolio piece ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Products Section */}
              <section data-testid="products-section">
                <h2 className="text-2xl font-bold mb-6">Available Products</h2>
                
                {productsLoading ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i}>
                        <Skeleton className="w-full h-48" />
                        <CardContent className="p-4">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-full mb-3" />
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-8 w-20" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : !products || products.length === 0 ? (
                  <div className="text-center py-12" data-testid="no-products">
                    <p className="text-muted-foreground">No products available from this artisan yet.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`product-${product.id}`}>
                        <div className="relative">
                          <img
                            src={(product.images && product.images[0]) || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=300&h=200"}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            data-testid={`product-image-${product.id}`}
                          />
                          <div className="absolute top-2 right-2">
                            <Button variant="ghost" size="icon" className="w-8 h-8 bg-white/80 rounded-full hover:bg-white" data-testid={`wishlist-${product.id}`}>
                              <Heart className="w-4 h-4 text-muted-foreground hover:text-primary" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2" data-testid={`product-name-${product.id}`}>
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`product-description-${product.id}`}>
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg text-primary" data-testid={`product-price-${product.id}`}>
                              ₹{(product.price / 100).toLocaleString()}
                            </span>
                            <Button size="sm" data-testid={`add-to-cart-${product.id}`}>
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
