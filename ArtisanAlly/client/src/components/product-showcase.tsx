import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  artisan?: {
    id: string;
    firstName: string;
    lastName: string;
    location: string;
  };
}

const categories = [
  { id: 'all', label: 'All Crafts' },
  { id: 'textiles', label: 'Textiles' },
  { id: 'pottery', label: 'Pottery' },
  { id: 'jewelry', label: 'Jewelry' },
  { id: 'woodwork', label: 'Woodwork' },
  { id: 'metalwork', label: 'Metalwork' },
];

export default function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', activeCategory !== 'all' ? { category: activeCategory } : {}],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30" data-testid="product-showcase-loading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Skeleton key={category.id} className="h-10 w-24 rounded-full" />
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-full mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30" data-testid="product-showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="font-serif italic text-primary">Handcrafted</span> with Love
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore unique, authentic pieces created by skilled artisans from across India
          </p>
        </div>

        {/* Product Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`px-6 py-2 rounded-full font-medium ${
                activeCategory === category.id 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
              onClick={() => setActiveCategory(category.id)}
              data-testid={`filter-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-12" data-testid="no-products">
            <p className="text-lg text-muted-foreground">
              {activeCategory === 'all' 
                ? 'No products available at the moment. Check back later!' 
                : `No ${categories.find(c => c.id === activeCategory)?.label.toLowerCase()} products available.`
              }
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group" data-testid={`product-card-${product.id}`}>
                <div className="relative">
                  <img 
                    src={product.images[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    data-testid={`product-image-${product.id}`}
                  />
                  <div className="absolute top-2 right-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="w-8 h-8 bg-white/80 rounded-full hover:bg-white"
                      data-testid={`wishlist-${product.id}`}
                    >
                      <Heart className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1" data-testid={`product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  {product.artisan && (
                    <p className="text-sm text-muted-foreground mb-2" data-testid={`product-artisan-${product.id}`}>
                      by {product.artisan.firstName} {product.artisan.lastName}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`product-description-${product.id}`}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg text-primary" data-testid={`product-price-${product.id}`}>
                      ₹{(product.price / 100).toLocaleString()}
                    </span>
                    <Button 
                      size="sm" 
                      className="px-3 py-1 text-sm"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-3 font-medium"
            data-testid="view-all-products"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
