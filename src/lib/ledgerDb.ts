// src/lib/ledgerDb.ts
// Offline-first storage for "दैनिक लेखा-जोखा" (Daily Ledger) using IndexedDB.
// No external packages required — works fully offline, syncs later if you add a backend.

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  village?: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  type: "जमा" | "उधार"; // "जमा" = received/credit, "उधार" = given/debit
  amount: number;
  note?: string;
  date: number; // epoch ms
}

const DB_NAME = "grameen_ledger_db";
const DB_VERSION = 1;
const STORE_CUSTOMERS = "customers";
const STORE_TRANSACTIONS = "transactions";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_CUSTOMERS)) {
        db.createObjectStore(STORE_CUSTOMERS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_TRANSACTIONS)) {
        const store = db.createObjectStore(STORE_TRANSACTIONS, { keyPath: "id" });
        store.createIndex("customerId", "customerId", { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const req = fn(store);
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

export const ledgerDb = {
  // ---- Customers ----
  async addCustomer(data: Omit<Customer, "id" | "createdAt">): Promise<Customer> {
    const customer: Customer = { ...data, id: uid(), createdAt: Date.now() };
    await withStore(STORE_CUSTOMERS, "readwrite", (s) => s.add(customer));
    return customer;
  },

  async getCustomers(): Promise<Customer[]> {
    const result = await withStore<Customer[]>(STORE_CUSTOMERS, "readonly", (s) => s.getAll());
    return result.sort((a, b) => b.createdAt - a.createdAt);
  },

  async deleteCustomer(id: string): Promise<void> {
    await withStore(STORE_CUSTOMERS, "readwrite", (s) => s.delete(id));
    const txns = await ledgerDb.getTransactionsForCustomer(id);
    const db = await openDb();
    const tx = db.transaction(STORE_TRANSACTIONS, "readwrite");
    txns.forEach((t) => tx.objectStore(STORE_TRANSACTIONS).delete(t.id));
  },

  // ---- Transactions ----
  async addTransaction(data: Omit<Transaction, "id">): Promise<Transaction> {
    const txn: Transaction = { ...data, id: uid() };
    await withStore(STORE_TRANSACTIONS, "readwrite", (s) => s.add(txn));
    return txn;
  },

  async deleteTransaction(id: string): Promise<void> {
    await withStore(STORE_TRANSACTIONS, "readwrite", (s) => s.delete(id));
  },

  async getAllTransactions(): Promise<Transaction[]> {
    const result = await withStore<Transaction[]>(STORE_TRANSACTIONS, "readonly", (s) => s.getAll());
    return result.sort((a, b) => b.date - a.date);
  },

  async getTransactionsForCustomer(customerId: string): Promise<Transaction[]> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_TRANSACTIONS, "readonly");
      const index = tx.objectStore(STORE_TRANSACTIONS).index("customerId");
      const req = index.getAll(customerId);
      req.onsuccess = () => resolve((req.result as Transaction[]).sort((a, b) => b.date - a.date));
      req.onerror = () => reject(req.error);
    });
  },

  // ---- Balance helper ----
  calcBalance(txns: Transaction[]): { jama: number; udhaar: number; balance: number } {
    const jama = txns.filter((t) => t.type === "जमा").reduce((s, t) => s + t.amount, 0);
    const udhaar = txns.filter((t) => t.type === "उधार").reduce((s, t) => s + t.amount, 0);
    return { jama, udhaar, balance: jama - udhaar };
  },
};
