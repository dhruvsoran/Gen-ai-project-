import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Artisan } from '@shared/schema';

export default function FeaturedArtisans() {
  const { data: artisans, isLoading } = useQuery<Artisan[]>({
    queryKey: ['/api/artisans/featured'],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30" data-testid="featured-artisans-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!artisans || artisans.length === 0) {
    return (
      <section className="py-20 bg-muted/30" data-testid="featured-artisans-empty">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our <span className="font-serif italic text-primary">Master Artisans</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No featured artisans available at the moment. Check back later!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30" data-testid="featured-artisans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our <span className="font-serif italic text-primary">Master Artisans</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the stories and craftsmanship of talented artisans preserving traditional techniques
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans.map((artisan) => (
            <Card key={artisan.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group" data-testid={`artisan-card-${artisan.id}`}>
              <div className="relative">
                <img 
                  src={artisan.portfolioImages?.[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250"} 
                  alt={`${artisan.firstName} ${artisan.lastName} - ${artisan.craftSpecialty} artisan`} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  data-testid={`artisan-image-${artisan.id}`}
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold" data-testid={`artisan-initials-${artisan.id}`}>
                      {artisan.firstName[0]}{artisan.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" data-testid={`artisan-name-${artisan.id}`}>
                      {artisan.firstName} {artisan.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`artisan-location-${artisan.id}`}>
                      {artisan.location || 'India'}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4" data-testid={`artisan-specialty-${artisan.id}`}>
                  {artisan.craftSpecialty} • {artisan.yearsOfExperience} years of experience
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1" data-testid={`artisan-rating-${artisan.id}`}>
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{artisan.rating || 5.0}</span>
                    <span className="text-sm text-muted-foreground">({artisan.reviewCount || 0})</span>
                  </div>
                  <Link href={`/artisan/${artisan.id}`} data-testid={`view-profile-${artisan.id}`}>
                    <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium text-sm p-0">
                      View Profile →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
