"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Package,
  AlertCircle,
  Loader2,
  Plus,
  Minus,
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
import { useProducts } from "@/lib/products";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");

  // Fetch products from API
  const { data: products, isLoading, error } = useProducts({
    search: searchQuery || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });

  // Cart store
  const { items, addItem, removeItem, updateQuantity, totalAmount, totalItems } =
    useCartStore();

  if (error) {
    toast.error("Failed to load products");
  }

  // Filter products client-side for grade
  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);
      const matchesGrade =
        gradeFilter === "all" || product.grade === gradeFilter;
      return matchesSearch && matchesGrade;
    }) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.basePrice,
      quantity: 1,
      unit: product.unit,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  const cartItemCount = (productId: string) => {
    const item = items.find((i) => i.productId === productId);
    return item?.quantity || 0;
  };

  return (
    <div className="space-y-6 pb-24">
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
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-primary text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cement-400" />
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
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <span className="ml-2 text-cement-600">Loading products...</span>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const isLowStock = false; // TODO: Fetch from inventory API
            const quantityInCart = cartItemCount(product.id);

            return (
              <Card
                key={product.id}
                className={cn(
                  "overflow-hidden transition-all hover:shadow-lg",
                  isLowStock && "border-amber-300"
                )}
              >
                <div className="aspect-square bg-cement-100 flex items-center justify-center relative">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Package className="w-24 h-24 text-cement-300" />
                  )}
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-cement-900">{product.name}</h3>
                      <p className="text-sm text-cement-500">{product.sku}</p>
                    </div>
                    <Badge variant={isLowStock ? "warning" : "success"}>
                      {isLowStock ? "Low Stock" : "In Stock"}
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

                    {quantityInCart > 0 ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => updateQuantity(product.id, -1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {quantityInCart}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() =>
                            addItem({
                              id: product.id,
                              productId: product.id,
                              name: product.name,
                              sku: product.sku,
                              price: product.basePrice,
                              quantity: 1,
                              unit: product.unit,
                              image: product.image,
                            })
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => handleAddToCart(product)} size="sm">
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-cement-300 mx-auto mb-4" />
          <p className="text-cement-500">No products found</p>
          <p className="text-sm text-cement-400 mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Cart Summary */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cement-200 p-4 shadow-lg lg:left-64 z-50">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <p className="font-medium text-cement-900">{totalItems} items in cart</p>
              <p className="text-sm text-cement-500">
                Total: {formatCurrency(totalAmount)}
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
