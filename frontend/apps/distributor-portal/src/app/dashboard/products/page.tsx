"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  Scale,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const products = [
  {
    id: "prod_001",
    name: "Dangote Cement 42.5R",
    sku: "DGC-42.5R-50",
    grade: "42.5R",
    category: "Premium",
    basePrice: 4500,
    stockLevel: 5000,
    reorderPoint: 1000,
    unit: "bag",
    image: "/products/cement-42.5r.png",
  },
  {
    id: "prod_002",
    name: "Dangote Cement 32.5R",
    sku: "DGC-32.5R-50",
    grade: "32.5R",
    category: "Standard",
    basePrice: 4200,
    stockLevel: 8000,
    reorderPoint: 1500,
    unit: "bag",
    image: "/products/cement-32.5r.png",
  },
  {
    id: "prod_003",
    name: "Dangote Cement 52.5R",
    sku: "DGC-52.5R-50",
    grade: "52.5R",
    category: "High Strength",
    basePrice: 5200,
    stockLevel: 2000,
    reorderPoint: 500,
    unit: "bag",
    image: "/products/cement-52.5r.png",
  },
  {
    id: "prod_004",
    name: "Dangote Pozzolana 32.5N",
    sku: "DPC-32.5N-50",
    grade: "32.5N",
    category: "Eco-Friendly",
    basePrice: 4100,
    stockLevel: 3500,
    reorderPoint: 800,
    unit: "bag",
    image: "/products/pozzo-cement.png",
  },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesGrade = gradeFilter === "all" || product.grade === gradeFilter;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const addToCart = (productId: string) => {
    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.basePrice || 0) * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-cement-900">Products</h2>
          <p className="text-cement-500">Browse our cement product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/cart">
            <Button variant="outline" className="relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
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
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => {
          const isLowStock = product.stockLevel <= product.reorderPoint;
          const inCart = cart.find((item) => item.productId === product.id);
          return (
            <Card
              key={product.id}
              className={cn(
                "overflow-hidden transition-all hover:shadow-lg",
                isLowStock && "border-amber-300"
              )}
            >
              <div className="aspect-square bg-cement-100 flex items-center justify-center">
                <Package className="w-24 h-24 text-cement-300" />
              </div>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-cement-900">{product.name}</h3>
                    <p className="text-sm text-cement-500">{product.sku}</p>
                  </div>
                  <Badge variant={isLowStock ? "warning" : "success"}>
                    {product.stockLevel.toLocaleString()} in stock
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="text-sm text-cement-500">Grade</p>
                    <p className="font-medium">{product.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-cement-500">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                </div>
                {isLowStock && (
                  <div className="flex items-center gap-2 mb-4 text-amber-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Low stock - order soon
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cement-500">Price per {product.unit}</p>
                    <p className="text-xl font-bold text-brand-primary">
                      {formatCurrency(product.basePrice)}
                    </p>
                  </div>
                  <Button
                    onClick={() => addToCart(product.id)}
                    size="sm"
                  >
                    {inCart ? `Added (${inCart.quantity})` : "Add to Cart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-cement-300 mx-auto mb-4" />
          <p className="text-cement-500">No products found</p>
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cement-200 p-4 shadow-lg lg:left-64">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <p className="font-medium text-cement-900">
                {cartCount} items in cart
              </p>
              <p className="text-sm text-cement-500">
                Total: {formatCurrency(cartTotal)}
              </p>
            </div>
            <Link href="/dashboard/cart">
              <Button>Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
