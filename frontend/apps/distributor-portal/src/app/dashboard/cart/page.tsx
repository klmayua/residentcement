"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  BankTransfer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cartItems = [
  {
    id: "cart_001",
    productId: "prod_001",
    name: "Dangote Cement 42.5R",
    sku: "DGC-42.5R-50",
    price: 4500,
    quantity: 100,
    unit: "bag",
  },
  {
    id: "cart_002",
    productId: "prod_002",
    name: "Dangote Cement 32.5R",
    sku: "DGC-32.5R-50",
    price: 4200,
    quantity: 50,
    unit: "bag",
  },
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [isProcessing, setIsProcessing] = useState(false);

  const updateQuantity = (itemId: string, delta: number) => {
    setItems(
      items
        .map((item) => {
          if (item.id === itemId) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
    );
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal >= 500000 ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert("Order placed successfully!");
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-cement-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-cement-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-cement-500 mb-6">
          Add some products to your cart to get started
        </p>
        <Link href="/dashboard/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-cement-900">Shopping Cart</h2>
          <p className="text-cement-500">{items.length} items in cart</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-cement-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-cement-500">{item.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Delivery Address"
                placeholder="Enter delivery address"
                defaultValue="123 Lagos Road, Victoria Island, Lagos"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="City" placeholder="Lagos" defaultValue="Lagos" />
                <Input label="State" placeholder="Lagos" defaultValue="Lagos" />
              </div>
              <Input
                label="Delivery Notes (Optional)"
                placeholder="Any special instructions"
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-cement-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Volume Discount (5%)</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-cement-600">Delivery</span>
                <Badge variant="success">Free</Badge>
              </div>
              <hr className="border-cement-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-brand-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <BankTransfer className="w-4 h-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Debit/Credit Card
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {paymentMethod === "bank_transfer" && (
                <div className="p-4 bg-cement-50 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-cement-700">
                    Bank Details
                  </p>
                  <p className="text-sm text-cement-600">
                    First Bank of Nigeria
                  </p>
                  <p className="text-sm font-medium text-cement-900">
                    1234567890
                  </p>
                  <p className="text-sm text-cement-600">
                    Resident Cement Ltd
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                isLoading={isProcessing}
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>

              <p className="text-xs text-cement-500 text-center">
                By placing this order, you agree to our Terms of Service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
