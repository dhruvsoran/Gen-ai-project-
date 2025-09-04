import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ArtisanDashboard() {
  const [artisanId, setArtisanId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("artisanId");
    setArtisanId(id);
  }, []);

  if (!artisanId) {
    return <div className="p-6 text-center">Please sign up or log in first.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
        <p className="mb-4">Your artisan ID: {artisanId}</p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border rounded-lg shadow bg-white">
            <h2 className="font-semibold mb-2">Profile</h2>
            <p>View and update your artisan details.</p>
          </div>
          
          <div className="p-6 border rounded-lg shadow bg-white">
            <h2 className="font-semibold mb-2">AI Story Generator</h2>
            <p>Create compelling stories about your craft.</p>
          </div>

          <div className="p-6 border rounded-lg shadow bg-white">
            <h2 className="font-semibold mb-2">Portfolio</h2>
            <p>Upload and manage your craft images.</p>
          </div>

          <div className="p-6 border rounded-lg shadow bg-white">
            <h2 className="font-semibold mb-2">Analytics</h2>
            <p>Track engagement and customer insights (coming soon).</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
