import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Store, Users, PlusCircle } from "lucide-react";

const ArtisanDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Artisan Panel</h2>
        <nav className="flex flex-col gap-3">
          <Button variant="ghost" className="justify-start">
            <Store className="mr-2 h-4 w-4" /> My Products
          </Button>
          <Button variant="ghost" className="justify-start">
            <Users className="mr-2 h-4 w-4" /> Customers
          </Button>
          <Button variant="ghost" className="justify-start">
            <BarChart3 className="mr-2 h-4 w-4" /> Analytics
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, Artisan 🎉</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-600">Total Products</p>
              <h2 className="text-2xl font-bold">12</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-600">Customers</p>
              <h2 className="text-2xl font-bold">85</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-gray-600">Monthly Sales</p>
              <h2 className="text-2xl font-bold">₹25,000</h2>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">My Products</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example product cards */}
            <Card>
              <CardContent className="p-4">
                <img
                  src="https://via.placeholder.com/150"
                  alt="product"
                  className="rounded-md mb-2"
                />
                <h3 className="font-bold">Handmade Pottery</h3>
                <p className="text-gray-600">₹500</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <img
                  src="https://via.placeholder.com/150"
                  alt="product"
                  className="rounded-md mb-2"
                />
                <h3 className="font-bold">Wooden Sculpture</h3>
                <p className="text-gray-600">₹1200</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtisanDashboard;
