import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { insertArtisanSchema, type InsertArtisan } from '@shared/schema';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { CloudUpload, Store, Bot, Globe, BarChart3 } from 'lucide-react';

const signupSchema = insertArtisanSchema.extend({
  portfolioFiles: typeof File !== 'undefined' ? insertArtisanSchema.shape.portfolioImages.optional() : insertArtisanSchema.shape.portfolioImages.optional(),
  terms: insertArtisanSchema.shape.firstName.transform(() => true),
});

type SignupFormData = Omit<InsertArtisan, 'portfolioImages'> & {
  portfolioFiles?: FileList;
  terms: boolean;
};

export default function ArtisanSignup() {
  const [, setLocation] = useLocation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      craftSpecialty: '',
      yearsOfExperience: '',
      biography: '',
      location: '',
      terms: false,
    },
  });

  const createArtisanMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'portfolioFiles' && key !== 'terms' && value) {
          formData.append(key, value.toString());
        }
      });

      // Add files
      selectedFiles.forEach((file) => {
        formData.append('portfolioImages', file);
      });

      const response = await fetch('/api/artisans', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create artisan profile');
      }

      return response.json();
    },
    onSuccess: (artisan) => {
  toast({
    title: 'Profile Created!',
    description: 'Welcome to Artisan Connect! Your profile has been created successfully.',
  });

  // Store artisan ID (or token, once backend provides it)
  localStorage.setItem("artisanId", artisan.id);

  // Redirect to dashboard instead of profile page
  setLocation(`/artisan-dashboard`);
},

    onError: (error) => {
      toast({
        title: 'Signup Failed',
        description: error instanceof Error ? error.message : 'Failed to create your profile. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      toast({
        title: 'Too Many Files',
        description: 'You can upload a maximum of 10 images.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedFiles(files);
  };

  const onSubmit = (data: SignupFormData) => {
    if (!data.terms) {
      toast({
        title: 'Terms Required',
        description: 'Please accept the terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }
    createArtisanMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="artisan-signup-page">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">
                Join Our <span className="font-serif italic text-primary">Artisan Community</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Share your craft with the world. Our platform empowers artisans with AI-driven 
                tools to showcase their work, tell their stories, and reach global audiences.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Store className="text-primary w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Create Your Digital Storefront</h3>
                  <p className="text-muted-foreground">Build a beautiful online presence to showcase your crafts and attract customers</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="text-primary w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI-Powered Story Generation</h3>
                  <p className="text-muted-foreground">Let AI help you craft compelling stories about your heritage and techniques</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Globe className="text-primary w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Global Market Access</h3>
                  <p className="text-muted-foreground">Reach customers worldwide with our international shipping and marketing support</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <BarChart3 className="text-primary w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Analytics & Insights</h3>
                  <p className="text-muted-foreground">Track your performance and optimize your listings with detailed analytics</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="shadow-xl" data-testid="signup-form-card">
            <CardHeader>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Start Your Journey</h2>
                <p className="text-muted-foreground">Join thousands of artisans already growing their business</p>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="first-name-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="last-name-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="email-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} data-testid="phone-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="craftSpecialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Craft Specialty</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="craft-specialty-select">
                              <SelectValue placeholder="Select your craft" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="textiles">Textiles & Weaving</SelectItem>
                            <SelectItem value="pottery">Pottery & Ceramics</SelectItem>
                            <SelectItem value="woodwork">Wood Carving & Furniture</SelectItem>
                            <SelectItem value="metalwork">Metal Crafts & Jewelry</SelectItem>
                            <SelectItem value="painting">Traditional Painting</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="experience-select">
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-5">1-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10-20">10-20 years</SelectItem>
                            <SelectItem value="20+">20+ years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State" {...field} value={field.value || ''} data-testid="location-input" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="biography"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell Us About Your Craft</FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-24 resize-none"
                            placeholder="Describe your craft, techniques, and what makes your work unique..."
                            {...field}
                            data-testid="biography-textarea"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Portfolio Images</FormLabel>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors mt-2">
                      <CloudUpload className="mx-auto text-3xl text-muted-foreground mb-2 w-8 h-8" />
                      <p className="text-muted-foreground mb-2">Drag & drop your images here, or click to browse</p>
                      <p className="text-sm text-muted-foreground mb-4">Upload up to 10 images (JPG, PNG, max 5MB each)</p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="portfolio-upload"
                        data-testid="portfolio-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('portfolio-upload')?.click()}
                        data-testid="portfolio-upload-button"
                      >
                        Choose Files
                      </Button>
                      {selectedFiles.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium">{selectedFiles.length} file(s) selected</p>
                          <div className="text-xs text-muted-foreground space-y-1 mt-2">
                            {selectedFiles.slice(0, 3).map((file, i) => (
                              <div key={i}>{file.name}</div>
                            ))}
                            {selectedFiles.length > 3 && (
                              <div>... and {selectedFiles.length - 3} more</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="terms-checkbox"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm text-muted-foreground">
                              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
                              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createArtisanMutation.isPending}
                    data-testid="create-profile-button"
                  >
                    {createArtisanMutation.isPending ? 'Creating Profile...' : 'Create My Artisan Profile'}
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <a href="#" className="text-primary hover:underline">Sign in here</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
