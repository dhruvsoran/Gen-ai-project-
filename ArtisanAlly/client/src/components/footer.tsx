import { Link } from 'wouter';
import { Palette, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="text-primary text-2xl" />
              <span className="font-serif font-semibold text-xl text-primary">Artisan Connect</span>
            </div>
            <p className="text-background/70">
              Empowering traditional artisans with AI-driven tools to showcase their craft 
              and reach global audiences.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-background/70 hover:text-background" data-testid="facebook-link">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-background" data-testid="instagram-link">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-background" data-testid="twitter-link">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-background" data-testid="youtube-link">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">For Artisans</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/artisan-signup" className="text-background/70 hover:text-background" data-testid="join-artisan-footer">
                  Join as Artisan
                </Link>
              </li>
              <li>
                <Link href="/#ai-story" className="text-background/70 hover:text-background" data-testid="ai-story-footer">
                  AI Story Generator
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background" data-testid="seller-resources-footer">
                  Seller Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background" data-testid="success-stories-footer">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">For Buyers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/discover" className="text-background/70 hover:text-background" data-testid="browse-crafts-footer">
                  Browse Crafts
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background" data-testid="custom-orders-footer">
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background" data-testid="gift-cards-footer">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background" data-testid="shipping-info-footer">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-background/70 hover:text-background" data-testid="help-center-footer">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background" data-testid="contact-us-footer">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background" data-testid="privacy-policy-footer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/70 hover:text-background" data-testid="terms-footer">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/70">
            © 2024 Artisan Connect. All rights reserved. Powered by Google Cloud AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
