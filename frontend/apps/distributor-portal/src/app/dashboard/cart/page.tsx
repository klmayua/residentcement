"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePaystackPayment } from "react-paystack";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Building2,
  CheckCircle,
  Loader2,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useInitializePayment, useVerifyPayment, getPaystackConfig } from "@/lib/payment";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalAmount } = useCartStore();
  const { user, customer } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [orderId, setOrderId] = useState("");

  const initializePayment = useInitializePayment();
  const verifyPayment = useVerifyPayment();

  // Paystack configuration
  const paystackConfig = PAYSTACK_PUBLIC_KEY
    ? getPaystackConfig(
        PAYSTACK_PUBLIC_KEY,
        user?.email || customer?.email || "",
        totalAmount,
        paymentReference
      )
    : null;

  const initializePaystack = usePaystackPayment(paystackConfig || {});

  const handleCheckout = async () => {
    if (!user && !customer) {
      toast.error("Please log in to complete your order");
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create order
      const orderData = {
        customerId: customer?.id || user?.id,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        deliveryAddress: {
          street: "123 Lagos Road", // TODO: Get from form
          city: "Lagos",
          state: "Lagos",
          country: "Nigeria",
        },
        totalAmount: totalAmount,
        currency: "NGN",
      };

      const orderResponse = await ordersApi.create(orderData);
      const createdOrderId = orderResponse.data.id || orderResponse.data.order?.id;
      setOrderId(createdOrderId);

      // Step 2: Initialize payment
      const paymentData = await initializePayment.mutateAsync({
        amount: totalAmount,
        currency: "NGN",
        customerId: customer?.id || user?.id,
        orderId: createdOrderId,
        email: user?.email || customer?.email || "",
        metadata: {
          orderId: createdOrderId,
          customerName: customer?.name || user?.name,
        },
      });

      if (paymentData.reference) {
        setPaymentReference(paymentData.reference);

        if (paymentMethod === "card" && PAYSTACK_PUBLIC_KEY) {
          // Step 3a: Open Paystack popup for card payments
          initializePaystack(onPaystackSuccess, onPaystackClose);
        } else if (paymentMethod === "bank_transfer") {
          // Step 3b: Show bank transfer instructions
          toast.success("Order created! Please complete bank transfer.");
          // TODO: Show bank details modal
          clearCart();
          router.push(`/dashboard/orders/${createdOrderId}`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  const onPaystackSuccess = async (reference: any) => {
    toast.success("Payment initiated! Verifying...");

    // Verify payment
    await verifyPayment.mutateAsync(paymentReference);

    // Clear cart and redirect
    clearCart();
    router.push(`/dashboard/orders/${orderId}`);
  };

  const onPaystackClose = () => {
    toast.info("Payment cancelled. You can retry from your orders page.");
    router.push("/dashboard/orders");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
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
                          <p className="font-medium text-cement-900">{item.name}</p>
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
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
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
                placeholder="Enter delivery address"
                defaultValue="123 Lagos Road, Victoria Island, Lagos"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="City" defaultValue="Lagos" />
                <Input placeholder="State" defaultValue="Lagos" />
              </div>
              <Input placeholder="Any special instructions" />
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
                <span className="font-medium">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cement-600">Delivery</span>
                <Badge variant="success">Free</Badge>
              </div>
              <hr className="border-cement-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-brand-primary">{formatCurrency(totalAmount)}</span>
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
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Pay with Card (Paystack)
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {paymentMethod === "bank_transfer" && (
                <div className="p-4 bg-cement-50 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-cement-700">Bank Details</p>
                  <p className="text-sm text-cement-600">First Bank of Nigeria</p>
                  <p className="text-sm font-medium text-cement-900">1234567890</p>
                  <p className="text-sm text-cement-600">Resident Cement Ltd</p>
                  <p className="text-xs text-cement-500 mt-2">Use your Order ID as reference</p>
                </div>
              )}

              {paymentMethod === "card" && !PAYSTACK_PUBLIC_KEY && (
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700">
                    Paystack public key not configured. Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to .env.local
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing || initializePayment.isPending}
              >
                {isProcessing || initializePayment.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" /
                    Place Order
                  </>
                )}
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
