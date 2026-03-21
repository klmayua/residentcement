"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  ArrowRight,
  Check,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Public product data - retail pricing
const publicProducts = [
  {
    id: "prod_001",
    name: "Dangote Cement 42.5R",
    sku: "DGC-42.5R-50",
    grade: "42.5R",
    category: "Premium",
    retailPrice: 4800,
    distributorPrice: 4500,
    stockLevel: 5000,
    unit: "bag",
    minOrder: 10,
    description: "High-strength cement for structural applications",
    image: "/products/cement-42.5r.png",
  },
  {
    id: "prod_002",
    name: "Dangote Cement 32.5R",
    sku: "DGC-32.5R-50",
    grade: "32.5R",
    category: "Standard",
    retailPrice: 4500,
    distributorPrice: 4200,
    stockLevel: 8000,
    unit: "bag",
    minOrder: 10,
    description: "General purpose cement for plastering and masonry",
    image: "/products/cement-32.5r.png",
  },
  {
    id: "prod_003",
    name: "Dangote Cement 52.5R",
    sku: "DGC-52.5R-50",
    grade: "52.5R",
    category: "High Strength",
    retailPrice: 5500,
    distributorPrice: 5200,
    stockLevel: 2000,
    unit: "bag",
    minOrder: 5,
    description: "Ultra-high strength for demanding projects",
    image: "/products/cement-52.5r.png",
  },
  {
    id: "prod_004",
    name: "Dangote Pozzolana 32.5N",
    sku: "DPC-32.5N-50",
    grade: "32.5N",
    category: "Eco-Friendly",
    retailPrice: 4400,
    distributorPrice: 4100,
    stockLevel: 3500,
    unit: "bag",
    minOrder: 10,
    description: "Environmentally friendly cement with pozzolanic properties",
    image: "/products/pozzo-cement.png",
  },
];

export default function PublicProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [showDistributorPricing, setShowDistributorPricing] = useState(false);

  const filteredProducts = publicProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesGrade =
      gradeFilter === "all" || product.grade === gradeFilter;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-cement-50">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-brand-dark via-brand-secondary to-brand-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cement Products
            </h1>
            <p className="text-xl text-cement-200">
              Premium quality cement for all your construction needs.
              Order directly or become a distributor for better pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-6 bg-white border-b border-cement-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-cement-700">
                View Pricing:
              </span>
              <div className="flex bg-cement-100 rounded-lg p-1">
                <button
                  onClick={() => setShowDistributorPricing(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !showDistributorPricing
                      ? "bg-white text-brand-primary shadow-sm"
                      : "text-cement-600 hover:text-cement-900"
                  }`}
                >
                  Retail
                </button>
                <button
                  onClick={() => setShowDistributorPricing(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    showDistributorPricing
                      ? "bg-white text-brand-primary shadow-sm"
                      : "text-cement-600 hover:text-cement-900"
                  }`}
                >
                  Distributor
                </button>
              </div>
            </div>

            {!showDistributorPricing && (
              <div className="flex items-center gap-2 text-sm text-cement-600">
                <Store className="h-4 w-4" />
                <span>
                  Save up to ₦300/bag as a distributor.{" "}
                  <Link
                    href="/contact/"
                    className="text-brand-primary hover:underline"
                  >
                    Apply now
                  </Link>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cement-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="High Strength">High Strength</SelectItem>
                  <SelectItem value="Eco-Friendly">Eco-Friendly</SelectItem>
                </SelectContent>
              </Select>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="42.5R">42.5R</SelectItem>
                  <SelectItem value="32.5R">32.5R</SelectItem>
                  <SelectItem value="52.5R">52.5R</SelectItem>
                  <SelectItem value="32.5N">32.5N</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-cement-100 flex items-center justify-center">
                  <Package className="h-20 w-20 text-cement-400" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.grade}</Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-cement-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-cement-500 mb-2">{product.sku}</p>
                  <p className="text-sm text-cement-600 mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-cement-600">
                      Min order: {product.minOrder} {product.unit}s
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-cement-100">
                    <div>
                      {showDistributorPricing ? (
                        <div>
                          <p className="text-xs text-cement-500 line-through">
                            {formatCurrency(product.retailPrice)}
                          </p>
                          <p className="text-2xl font-bold text-brand-primary">
                            {formatCurrency(product.distributorPrice)}
                          </p>
                          <p className="text-xs text-green-600">
                            Save {formatCurrency(product.retailPrice - product.distributorPrice)}/bag
                          </p>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-cement-900">
                          {formatCurrency(product.retailPrice)}
                        </p>
                      )}
                      <p className="text-xs text-cement-500">
                        per {product.unit}
                      </p>
                    </div>

                    <Link href="/contact/">
                      <Button>
                        {showDistributorPricing ? "Apply" : "Order"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-cement-300 mx-auto mb-4" />
              <p className="text-cement-500">No products found</p>
              <p className="text-sm text-cement-400 mt-1">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Become a Distributor CTA */}
      {!showDistributorPricing && (
        <section className="py-16 bg-brand-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <Store className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                Become a Distributor
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join our network of distributors and enjoy exclusive pricing,
                dedicated support, and priority delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact/">
                  <Button
                    size="lg"
                    className="bg-brand-accent text-brand-dark hover:bg-brand-accent/90"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="http://localhost:3000" target="_blank">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Distributor Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
