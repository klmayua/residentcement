import { z } from "zod";

export const CustomerCreatedEvent = z.object({
  customerId: z.string(),
  email: z.string().email(),
  companyName: z.string(),
  phone: z.string(),
  tier: z.enum(["bronze", "silver", "gold", "platinum"]),
  creditLimit: z.number(),
  createdAt: z.string(),
});

export const CustomerUpdatedEvent = z.object({
  customerId: z.string(),
  changes: z.record(z.unknown()),
  updatedAt: z.string(),
});

export const OrderPlacedEvent = z.object({
  orderId: z.string(),
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    total: z.number(),
  })),
  totalAmount: z.number(),
  paymentMethod: z.string(),
  deliveryAddress: z.string(),
  createdAt: z.string(),
});

export const OrderCancelledEvent = z.object({
  orderId: z.string(),
  customerId: z.string(),
  reason: z.string().optional(),
  cancelledAt: z.string(),
});

export const OrderFulfilledEvent = z.object({
  orderId: z.string(),
  customerId: z.string(),
  deliveredAt: z.string(),
});

export const PaymentReceivedEvent = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  reference: z.string(),
  paymentMethod: z.string(),
  receivedAt: z.string(),
});

export const PaymentFailedEvent = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  reason: z.string(),
  failedAt: z.string(),
});

export const InventoryAdjustedEvent = z.object({
  inventoryId: z.string(),
  productId: z.string(),
  location: z.string(),
  previousQuantity: z.number(),
  newQuantity: z.number(),
  adjustment: z.number(),
  reason: z.string(),
  adjustedBy: z.string(),
  adjustedAt: z.string(),
});

export const ProductPriceChangedEvent = z.object({
  productId: z.string(),
  previousPrice: z.number(),
  newPrice: z.number(),
  effectiveFrom: z.string(),
  changedBy: z.string(),
});

export const ShipmentDispatchedEvent = z.object({
  shipmentId: z.string(),
  orderId: z.string(),
  driverId: z.string(),
  vehicleId: z.string(),
  estimatedArrival: z.string(),
  dispatchedAt: z.string(),
});

export const ShipmentDeliveredEvent = z.object({
  shipmentId: z.string(),
  orderId: z.string(),
  deliveredAt: z.string(),
  proofOfDelivery: z.object({
    recipientName: z.string(),
    signature: z.string().optional(),
    photoUrl: z.string().optional(),
  }),
});

export const ProductionBatchStartedEvent = z.object({
  batchId: z.string(),
  productId: z.string(),
  plannedQuantity: z.number(),
  startedAt: z.string(),
});

export const ProductionBatchCompletedEvent = z.object({
  batchId: z.string(),
  productId: z.string(),
  plannedQuantity: z.number(),
  actualQuantity: z.number(),
  qualityStatus: z.enum(["passed", "failed"]),
  completedAt: z.string(),
});

export const QualityCheckPassedEvent = z.object({
  checkId: z.string(),
  batchId: z.string(),
  productId: z.string(),
  tests: z.array(z.object({
    name: z.string(),
    value: z.number(),
    threshold: z.number(),
    passed: z.boolean(),
  })),
  checkedBy: z.string(),
  checkedAt: z.string(),
});

export const QualityCheckFailedEvent = z.object({
  checkId: z.string(),
  batchId: z.string(),
  productId: z.string(),
  failures: z.array(z.object({
    testName: z.string(),
    expectedValue: z.number(),
    actualValue: z.number(),
  })),
  checkedBy: z.string(),
  checkedAt: z.string(),
});

export type TCustomerCreatedEvent = z.infer<typeof CustomerCreatedEvent>;
export type TCustomerUpdatedEvent = z.infer<typeof CustomerUpdatedEvent>;
export type TOrderPlacedEvent = z.infer<typeof OrderPlacedEvent>;
export type TOrderCancelledEvent = z.infer<typeof OrderCancelledEvent>;
export type TOrderFulfilledEvent = z.infer<typeof OrderFulfilledEvent>;
export type TPaymentReceivedEvent = z.infer<typeof PaymentReceivedEvent>;
export type TPaymentFailedEvent = z.infer<typeof PaymentFailedEvent>;
export type TInventoryAdjustedEvent = z.infer<typeof InventoryAdjustedEvent>;
export type TProductPriceChangedEvent = z.infer<typeof ProductPriceChangedEvent>;
export type TShipmentDispatchedEvent = z.infer<typeof ShipmentDispatchedEvent>;
export type TShipmentDeliveredEvent = z.infer<typeof ShipmentDeliveredEvent>;
export type TProductionBatchStartedEvent = z.infer<typeof ProductionBatchStartedEvent>;
export type TProductionBatchCompletedEvent = z.infer<typeof ProductionBatchCompletedEvent>;
export type TQualityCheckPassedEvent = z.infer<typeof QualityCheckPassedEvent>;
export type TQualityCheckFailedEvent = z.infer<typeof QualityCheckFailedEvent>;

export const EventSchema = z.object({
  eventId: z.string(),
  eventType: z.string(),
  source: z.string(),
  timestamp: z.string(),
  data: z.record(z.unknown()),
  traceId: z.string(),
});
