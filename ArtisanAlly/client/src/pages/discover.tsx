import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useSearch } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Star, MapPin, Heart, User, Package } from 'lucide-react';
import { Link } from 'wouter';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import type { Artisan, Product } from '@shared/schema';

interface SearchResults {
  artisans: Artisan[];
  products: (Product & { 
    artisan?: { 
      id: string; 
      firstName: string; 
      lastName: string; 
      location?: string; 
    } 
  })[];
}

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'textiles', label: 'Textiles & Weaving' },
  { id: 'pottery', label: 'Pottery & Ceramics' },
  { id: 'woodwork', label: 'Wood Carving & Furniture' },
  { id: 'metalwork', label: 'Metal Crafts & Jewelry' },
  { id: 'painting', label: 'Traditional Painting' },
  { id: 'jewelry', label: 'Jewelry' },
  { id: 'other', label: 'Other Crafts' },
];

const sortOptions = [
  { id: 'relevance', label: 'Most Relevant' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'newest', label: 'Newest First' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
];

export default function Discover() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'all' | 'artisans' | 'products'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  // Get search query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const q = urlParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [search]);

  // Fetch search results
  const { data: searchResults, isLoading } = useQuery<SearchResults>({
    queryKey: ['/api/search', { q: searchQuery }],
    enabled: !!searchQuery,
  });

  // Fetch all products for category filtering
  const { data: allProducts, isLoading: productsLoading } = useQuery<(Product & { artisan?: { id: string; firstName: string; lastName: string; location?: string; } })[]>({
    queryKey: ['/api/products'],
    enabled: !searchQuery,
  });

  // Fetch all artisans when no search query
  const { data: allArtisans, isLoading: artisansLoading } = useQuery<Artisan[]>({
    queryKey: ['/api/artisans'],
    enabled: !searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setLocation('/discover');
    }
  };

  const filteredProducts = searchQuery ? searchResults?.products : allProducts;
  const filteredArtisans = searchQuery ? searchResults?.artisans : allArtisans;

  // Filter products by category
  const categoryFilteredProducts = filteredProducts?.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  ) || [];

  // Sort products
  const sortedProducts = [...categoryFilteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'rating':
        return 0; // Would need rating data on products
      default:
        return 0;
    }
  });

  const isSearching = !!searchQuery;
  const hasResults = searchResults && (searchResults.artisans.length > 0 || searchResults.products.length > 0);
  const showResults = isSearching ? hasResults : true;

  return (
    <div className="min-h-screen bg-background" data-testid="discover-page">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover <span className="font-serif italic text-primary">Authentic Crafts</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore unique handcrafted pieces and connect with talented artisans preserving traditional techniques
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search artisans, crafts, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg"
                data-testid="search-input"
              />
              <Search className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
              <Button 
                type="submit" 
                className="absolute right-2 top-2 px-4"
                data-testid="search-button"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48" data-testid="category-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48" data-testid="sort-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Section */}
        {isLoading || productsLoading || artisansLoading ? (
          <div className="space-y-8" data-testid="discover-loading">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Searching for amazing crafts...</span>
              </div>
            </div>
            
            <Tabs value="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="artisans">Artisans</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="w-full h-48" />
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2 mb-3" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : !showResults ? (
          <div className="text-center py-16" data-testid="no-results">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any artisans or products matching "{searchQuery}"
            </p>
            <Button onClick={() => { setSearchQuery(''); setLocation('/discover'); }} data-testid="clear-search">
              Clear Search
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="all" data-testid="tab-all">
                All Results
                {isSearching && searchResults && (
                  <Badge variant="secondary" className="ml-2">
                    {searchResults.artisans.length + searchResults.products.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="artisans" data-testid="tab-artisans">
                <User className="w-4 h-4 mr-2" />
                Artisans
                {isSearching && searchResults && (
                  <Badge variant="secondary" className="ml-2">
                    {searchResults.artisans.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="products" data-testid="tab-products">
                <Package className="w-4 h-4 mr-2" />
                Products
                {isSearching && searchResults && (
                  <Badge variant="secondary" className="ml-2">
                    {searchResults.products.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* All Results Tab */}
            <TabsContent value="all" className="space-y-8">
              {/* Artisans Section */}
              {filteredArtisans && filteredArtisans.length > 0 && (
                <section data-testid="artisans-section">
                  <h2 className="text-2xl font-bold mb-6">
                    Artisans {isSearching && `matching "${searchQuery}"`}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredArtisans.slice(0, 6).map((artisan) => (
                      <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`artisan-card-${artisan.id}`}>
                        <div className="relative">
                          <img
                            src={artisan.portfolioImages?.[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=200"}
                            alt={`${artisan.firstName} ${artisan.lastName}`}
                            className="w-full h-48 object-cover"
                            data-testid={`artisan-image-${artisan.id}`}
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {artisan.firstName[0]}{artisan.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold" data-testid={`artisan-name-${artisan.id}`}>
                                {artisan.firstName} {artisan.lastName}
                              </h3>
                              {artisan.location && (
                                <p className="text-sm text-muted-foreground flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {artisan.location}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary" className="mb-2">
                            {artisan.craftSpecialty}
                          </Badge>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {artisan.yearsOfExperience} years of experience
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-accent text-accent" />
                              <span className="text-sm font-medium">{artisan.rating || 5.0}</span>
                            </div>
                            <Link href={`/artisan/${artisan.id}`} data-testid={`view-artisan-${artisan.id}`}>
                              <Button variant="ghost" size="sm" className="text-primary">
                                View Profile
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {filteredArtisans.length > 6 && (
                    <div className="text-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('artisans')}
                        data-testid="view-all-artisans"
                      >
                        View All {filteredArtisans.length} Artisans
                      </Button>
                    </div>
                  )}
                </section>
              )}

              {/* Products Section */}
              {sortedProducts.length > 0 && (
                <section data-testid="products-section">
                  <h2 className="text-2xl font-bold mb-6">
                    Products {isSearching && `matching "${searchQuery}"`}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.slice(0, 8).map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group" data-testid={`product-card-${product.id}`}>
                        <div className="relative">
                          <img
                            src={(product.images && product.images[0]) || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=300&h=200"}
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
                            <Link href={`/artisan/${product.artisan.id}`} className="text-sm text-muted-foreground hover:text-primary">
                              by {product.artisan.firstName} {product.artisan.lastName}
                            </Link>
                          )}
                          <p className="text-sm text-muted-foreground mt-2 mb-3 line-clamp-2">
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
                  {sortedProducts.length > 8 && (
                    <div className="text-center mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('products')}
                        data-testid="view-all-products"
                      >
                        View All {sortedProducts.length} Products
                      </Button>
                    </div>
                  )}
                </section>
              )}

              {/* No results in combined view */}
              {(!filteredArtisans || filteredArtisans.length === 0) && sortedProducts.length === 0 && (
                <div className="text-center py-16" data-testid="no-results-all">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                  <p className="text-muted-foreground">
                    {isSearching 
                      ? `No artisans or products found for "${searchQuery}"` 
                      : `No ${selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.label.toLowerCase() + ' ' : ''}products available`
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Artisans Only Tab */}
            <TabsContent value="artisans">
              {filteredArtisans && filteredArtisans.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="artisans-grid">
                  {filteredArtisans.map((artisan) => (
                    <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`artisan-detail-card-${artisan.id}`}>
                      <div className="relative">
                        <img
                          src={artisan.portfolioImages?.[0] || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=200"}
                          alt={`${artisan.firstName} ${artisan.lastName}`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {artisan.firstName[0]}{artisan.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {artisan.firstName} {artisan.lastName}
                            </h3>
                            {artisan.location && (
                              <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {artisan.location}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary" className="mb-3">
                          {artisan.craftSpecialty}
                        </Badge>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {artisan.biography}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span className="text-sm font-medium">{artisan.rating || 5.0}</span>
                            <span className="text-sm text-muted-foreground">({artisan.reviewCount || 0})</span>
                          </div>
                          <Link href={`/artisan/${artisan.id}`}>
                            <Button variant="ghost" className="text-primary font-medium">
                              View Profile →
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16" data-testid="no-artisans">
                  <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Artisans Found</h3>
                  <p className="text-muted-foreground">
                    {isSearching ? `No artisans found matching "${searchQuery}"` : 'No artisans available at the moment'}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Products Only Tab */}
            <TabsContent value="products">
              {sortedProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
                  {sortedProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group" data-testid={`product-detail-card-${product.id}`}>
                      <div className="relative">
                        <img
                          src={(product.images && product.images[0]) || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=300&h=200"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 bg-white/80 rounded-full hover:bg-white"
                          >
                            <Heart className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-white/90">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        {product.artisan && (
                          <Link href={`/artisan/${product.artisan.id}`} className="text-sm text-muted-foreground hover:text-primary mb-2 block">
                            by {product.artisan.firstName} {product.artisan.lastName}
                            {product.artisan.location && (
                              <span className="flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {product.artisan.location}
                              </span>
                            )}
                          </Link>
                        )}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.aiGeneratedDescription || product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-lg text-primary">
                            ₹{(product.price / 100).toLocaleString()}
                          </span>
                          <Button size="sm">
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16" data-testid="no-products">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                  <p className="text-muted-foreground">
                    {isSearching 
                      ? `No products found matching "${searchQuery}"` 
                      : selectedCategory !== 'all' 
                        ? `No ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()} products available`
                        : 'No products available at the moment'
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Footer />
    </div>
  );
}
