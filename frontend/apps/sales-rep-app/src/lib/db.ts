import { openDB, DBSchema, IDBPDatabase } from "idb";

interface SalesRepDB extends DBSchema {
  customers: {
    key: string;
    value: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      synced: boolean;
      createdAt: string;
    };
    indexes: { "by-synced": boolean };
  };
  orders: {
    key: string;
    value: {
      id: string;
      customerId: string;
      items: any[];
      total: number;
      status: "pending" | "synced" | "failed";
      createdAt: string;
      gpsLocation?: { lat: number; lng: number };
    };
    indexes: { "by-status": string };
  };
  checkins: {
    key: string;
    value: {
      id: string;
      customerId: string;
      lat: number;
      lng: number;
      timestamp: string;
      synced: boolean;
    };
    indexes: { "by-synced": boolean };
  };
}

const DB_NAME = "sales-rep-db";
const DB_VERSION = 1;

export async function initDB(): Promise<IDBPDatabase<SalesRepDB>> {
  return openDB<SalesRepDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("customers")) {
        const customerStore = db.createObjectStore("customers", { keyPath: "id" });
        customerStore.createIndex("by-synced", "synced");
      }
      if (!db.objectStoreNames.contains("orders")) {
        const orderStore = db.createObjectStore("orders", { keyPath: "id" });
        orderStore.createIndex("by-status", "status");
      }
      if (!db.objectStoreNames.contains("checkins")) {
        const checkinStore = db.createObjectStore("checkins", { keyPath: "id" });
        checkinStore.createIndex("by-synced", "synced");
      }
    },
  });
}

// Customer operations
export async function saveCustomer(customer: any) {
  const db = await initDB();
  await db.put("customers", { ...customer, synced: false });
}

export async function getCustomers() {
  const db = await initDB();
  return db.getAll("customers");
}

export async function getUnsyncedCustomers() {
  const db = await initDB();
  return db.getAllFromIndex("customers", "by-synced", false);
}

export async function markCustomerSynced(id: string) {
  const db = await initDB();
  const customer = await db.get("customers", id);
  if (customer) {
    await db.put("customers", { ...customer, synced: true });
  }
}

// Order operations
export async function saveOrder(order: any) {
  const db = await initDB();
  await db.put("orders", { ...order, status: "pending" });
}

export async function getPendingOrders() {
  const db = await initDB();
  return db.getAllFromIndex("orders", "by-status", "pending");
}

export async function updateOrderStatus(id: string, status: "synced" | "failed") {
  const db = await initDB();
  const order = await db.get("orders", id);
  if (order) {
    await db.put("orders", { ...order, status });
  }
}

// Check-in operations
export async function saveCheckin(checkin: any) {
  const db = await initDB();
  await db.put("checkins", { ...checkin, synced: false });
}

export async function getUnsyncedCheckins() {
  const db = await initDB();
  return db.getAllFromIndex("checkins", "by-synced", false);
}
