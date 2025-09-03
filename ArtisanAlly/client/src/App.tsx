import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ArtisanSignup from "@/pages/artisan-signup";
import ArtisanProfile from "@/pages/artisan-profile";
import Discover from "@/pages/discover";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/artisan-signup" component={ArtisanSignup} />
      <Route path="/artisan/:id" component={ArtisanProfile} />
      <Route path="/discover" component={Discover} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
