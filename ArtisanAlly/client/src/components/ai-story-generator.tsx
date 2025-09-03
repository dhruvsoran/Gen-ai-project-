import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface StoryFormData {
  userInput: string;
  craftType: string;
  experience: string;
}

export default function AIStoryGenerator() {
  const [formData, setFormData] = useState<StoryFormData>({
    userInput: '',
    craftType: '',
    experience: '',
  });
  const [generatedStory, setGeneratedStory] = useState('');
  const { toast } = useToast();

  const generateStoryMutation = useMutation({
    mutationFn: async (data: StoryFormData) => {
      const response = await apiRequest('POST', '/api/stories/generate', {
        ...data,
        artisanId: 'demo-user', // For demo purposes
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedStory(data.story);
      toast({
        title: 'Story Generated!',
        description: 'Your AI-powered story has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate story. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userInput.trim() || !formData.craftType || !formData.experience) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields to generate your story.',
        variant: 'destructive',
      });
      return;
    }
    generateStoryMutation.mutate(formData);
  };

  return (
    <section className="py-20" data-testid="ai-story-generator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Let <span className="text-primary">AI</span> Tell Your 
                <span className="font-serif italic"> Story</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Our advanced AI helps you craft compelling stories about your craft, 
                heritage, and creative process. Share your passion with the world in words 
                that resonate.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="text-primary w-5 h-5" />
                <span className="font-medium">Personalized storytelling based on your craft</span>
              </div>
              <div className="flex items-center space-x-3">
                <Bot className="text-primary w-5 h-5" />
                <span className="font-medium">AI-powered content generation</span>
              </div>
              <div className="flex items-center space-x-3">
                <Sparkles className="text-primary w-5 h-5" />
                <span className="font-medium">Marketing content optimized for your audience</span>
              </div>
            </div>
          </div>

          <Card className="shadow-xl" data-testid="story-generator-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">AI Story Generator</h3>
                <div className="flex items-center space-x-2 text-primary">
                  <Bot className="w-5 h-5" />
                  <span className="text-sm font-medium">Powered by Google AI</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="userInput">Tell us about your craft</Label>
                  <Textarea 
                    id="userInput"
                    className="mt-2 h-24 resize-none"
                    placeholder="I create traditional pottery using techniques passed down through generations..."
                    value={formData.userInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, userInput: e.target.value }))}
                    data-testid="craft-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="craftType">Craft Type</Label>
                    <Select value={formData.craftType} onValueChange={(value) => setFormData(prev => ({ ...prev, craftType: value }))}>
                      <SelectTrigger className="mt-2" data-testid="craft-type-select">
                        <SelectValue placeholder="Select craft" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pottery">Pottery</SelectItem>
                        <SelectItem value="textiles">Textiles</SelectItem>
                        <SelectItem value="woodwork">Wood Carving</SelectItem>
                        <SelectItem value="metalwork">Metalwork</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                      <SelectTrigger className="mt-2" data-testid="experience-select">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10-20">10-20 years</SelectItem>
                        <SelectItem value="20+">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={generateStoryMutation.isPending}
                  data-testid="generate-story-button"
                >
                  {generateStoryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate My Story
                    </>
                  )}
                </Button>
              </form>

              {generatedStory && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border-l-4 border-l-primary" data-testid="generated-story">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="text-primary w-4 h-4" />
                    <span className="text-sm font-medium text-primary">AI Generated Story</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">
                    {generatedStory}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
