import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Menu, X, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
              <Palette className="text-primary text-2xl" />
              <span className="font-serif font-semibold text-xl text-primary">
                Artisan Connect
              </span>
            </Link>
          </div>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search artisans, crafts, or stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4"
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/discover" 
              className="hidden md:block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="discover-link"
            >
              Discover
            </Link>
            <Link href="/artisan-signup" data-testid="join-artisan-link">
              <Button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Join as Artisan
              </Button>
            </Link>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10"
                      data-testid="mobile-search-input"
                    />
                    <Search className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  </form>
                  
                  <div className="flex flex-col space-y-4">
                    <Link 
                      href="/discover" 
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                      data-testid="mobile-discover-link"
                    >
                      Discover
                    </Link>
                    <Link 
                      href="/artisan-signup" 
                      className="text-lg font-medium text-primary hover:text-primary/80 transition-colors"
                      onClick={() => setIsOpen(false)}
                      data-testid="mobile-join-artisan-link"
                    >
                      Join as Artisan
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
