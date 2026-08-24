// src/components/DailyLedger.tsx
// दैनिक लेखा-जोखा — गाँव के लोग के रोजमर्रा के लेन-देन के हिसाब रखे वाला मॉड्यूल
// पूरा ऑफलाइन काम करेला (IndexedDB), नेट रहे त भी चलेला।

import { useEffect, useMemo, useState } from "react";
import { Plus, ArrowLeft, TrendingUp, TrendingDown, Trash2, Wallet, Users, WifiOff } from "lucide-react";
import { ledgerDb, type Customer, type Transaction } from "../lib/ledgerDb";

export default function DailyLedger() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddTxn, setShowAddTxn] = useState<"जमा" | "उधार" | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    refreshCustomers();
  }, []);

  useEffect(() => {
    if (selected) refreshTxns(selected.id);
  }, [selected]);

  async function refreshCustomers() {
    setCustomers(await ledgerDb.getCustomers());
  }

  async function refreshTxns(customerId: string) {
    setTxns(await ledgerDb.getTransactionsForCustomer(customerId));
  }

  const totals = useMemo(() => {
    // overall totals across everyone, for the home screen summary card
    return null;
  }, [customers]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-emerald-700 text-white shadow-md">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selected ? (
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-full hover:bg-emerald-600 active:bg-emerald-800 transition"
                aria-label="वापस"
              >
                <ArrowLeft size={22} />
              </button>
            ) : (
              <Wallet size={24} />
            )}
            <h1 className="text-lg font-bold">
              {selected ? selected.name : "दैनिक लेखा-जोखा"}
            </h1>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
              isOnline ? "bg-emerald-600" : "bg-amber-500"
            }`}
          >
            {!isOnline && <WifiOff size={12} />}
            {isOnline ? "ऑनलाइन" : "ऑफलाइन मोड"}
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-28 pt-4">
        {!selected ? (
          <CustomerList
            customers={customers}
            onSelect={setSelected}
            onAddClick={() => setShowAddCustomer(true)}
          />
        ) : (
          <CustomerDetail
            customer={selected}
            txns={txns}
            onAddJama={() => setShowAddTxn("जमा")}
            onAddUdhaar={() => setShowAddTxn("उधार")}
            onDeleteTxn={async (id) => {
              await ledgerDb.deleteTransaction(id);
              refreshTxns(selected.id);
            }}
          />
        )}
      </main>

      {/* Floating action button — only on the customer list screen */}
      {!selected && (
        <button
          onClick={() => setShowAddCustomer(true)}
          className="fixed bottom-6 right-6 max-w-md mx-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center"
          aria-label="नया ग्राहक जोड़ीं"
        >
          <Plus size={28} />
        </button>
      )}

      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onSave={async (data) => {
            const c = await ledgerDb.addCustomer(data);
            await refreshCustomers();
            setShowAddCustomer(false);
            setSelected(c);
          }}
        />
      )}

      {showAddTxn && selected && (
        <AddTransactionModal
          type={showAddTxn}
          onClose={() => setShowAddTxn(null)}
          onSave={async (amount, note) => {
            await ledgerDb.addTransaction({
              customerId: selected.id,
              type: showAddTxn,
              amount,
              note,
              date: Date.now(),
            });
            await refreshTxns(selected.id);
            setShowAddTxn(null);
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function CustomerList({
  customers,
  onSelect,
  onAddClick,
}: {
  customers: Customer[];
  onSelect: (c: Customer) => void;
  onAddClick: () => void;
}) {
  if (customers.length === 0) {
    return (
      <div className="text-center mt-20 text-emerald-900/70">
        <Users size={48} className="mx-auto mb-3 opacity-40" />
        <p className="text-lg font-medium">कवनो ग्राहक नईखे जोड़ल</p>
        <p className="text-sm mt-1">नीचे + बटन दबा के पहिला ग्राहक जोड़ीं</p>
        <button
          onClick={onAddClick}
          className="mt-5 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow active:scale-95 transition"
        >
          + नया ग्राहक जोड़ीं
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-emerald-900/60 font-medium px-1 mb-2">
        {customers.length} ग्राहक
      </p>
      {customers.map((c) => (
        <CustomerRow key={c.id} customer={c} onClick={() => onSelect(c)} />
      ))}
    </div>
  );
}

function CustomerRow({ customer, onClick }: { customer: Customer; onClick: () => void }) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    ledgerDb.getTransactionsForCustomer(customer.id).then((txns) => {
      setBalance(ledgerDb.calcBalance(txns).balance);
    });
  }, [customer.id]);

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-sm border border-emerald-100 p-4 flex items-center justify-between active:scale-[0.98] transition text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
          {customer.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{customer.name}</p>
          {customer.village && <p className="text-xs text-gray-500">{customer.village}</p>}
        </div>
      </div>
      {balance !== null && (
        <span
          className={`text-sm font-bold ${
            balance >= 0 ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {balance >= 0 ? "+" : ""}
          ₹{Math.abs(balance).toLocaleString("hi-IN")}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------

function CustomerDetail({
  customer,
  txns,
  onAddJama,
  onAddUdhaar,
  onDeleteTxn,
}: {
  customer: Customer;
  txns: Transaction[];
  onAddJama: () => void;
  onAddUdhaar: () => void;
  onDeleteTxn: (id: string) => void;
}) {
  const { jama, udhaar, balance } = ledgerDb.calcBalance(txns);

  return (
    <div>
      {/* Balance summary card */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mb-4">
        <p className="text-xs text-gray-500 mb-1">कुल बैलेंस</p>
        <p className={`text-3xl font-bold ${balance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
          ₹{Math.abs(balance).toLocaleString("hi-IN")}
          <span className="text-sm font-normal text-gray-500 ml-2">
            {balance >= 0 ? "(पावे के बा)" : "(देवे के बा)"}
          </span>
        </p>
        <div className="flex gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1 text-emerald-600">
            <TrendingUp size={16} /> जमा ₹{jama.toLocaleString("hi-IN")}
          </div>
          <div className="flex items-center gap-1 text-rose-600">
            <TrendingDown size={16} /> उधार ₹{udhaar.toLocaleString("hi-IN")}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={onAddJama}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold shadow active:scale-95 transition flex items-center justify-center gap-1"
        >
          <TrendingUp size={18} /> जमा जोड़ीं
        </button>
        <button
          onClick={onAddUdhaar}
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-3 font-semibold shadow active:scale-95 transition flex items-center justify-center gap-1"
        >
          <TrendingDown size={18} /> उधार जोड़ीं
        </button>
      </div>

      {/* Transaction history */}
      <p className="text-sm text-emerald-900/60 font-medium px-1 mb-2">लेन-देन के इतिहास</p>
      {txns.length === 0 ? (
        <p className="text-center text-gray-400 mt-10 text-sm">अभी तक कवनो लेन-देन नईखे</p>
      ) : (
        <div className="space-y-2">
          {txns.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-emerald-100 p-3 flex items-center justify-between"
            >
              <div>
                <p className={`font-semibold ${t.type === "जमा" ? "text-emerald-600" : "text-rose-600"}`}>
                  {t.type === "जमा" ? "+" : "-"}₹{t.amount.toLocaleString("hi-IN")}
                </p>
                {t.note && <p className="text-xs text-gray-500">{t.note}</p>}
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {new Date(t.date).toLocaleDateString("hi-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => onDeleteTxn(t.id)}
                className="text-gray-300 hover:text-rose-500 p-2"
                aria-label="मेटाईं"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function AddCustomerModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: { name: string; phone?: string; village?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");

  return (
    <Modal onClose={onClose} title="नया ग्राहक जोड़ीं">
      <div className="space-y-3">
        <Field label="नाम *" value={name} onChange={setName} placeholder="जइसे: राम प्रसाद" />
        <Field label="मोबाइल नंबर" value={phone} onChange={setPhone} placeholder="वैकल्पिक" type="tel" />
        <Field label="गाँव" value={village} onChange={setVillage} placeholder="वैकल्पिक" />
        <button
          disabled={!name.trim()}
          onClick={() => onSave({ name: name.trim(), phone: phone.trim(), village: village.trim() })}
          className="w-full bg-emerald-600 disabled:bg-gray-300 text-white rounded-xl py-3 font-semibold mt-2 active:scale-95 transition"
        >
          जोड़ीं
        </button>
      </div>
    </Modal>
  );
}

function AddTransactionModal({
  type,
  onClose,
  onSave,
}: {
  type: "जमा" | "उधार";
  onClose: () => void;
  onSave: (amount: number, note?: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const color = type === "जमा" ? "emerald" : "rose";

  return (
    <Modal onClose={onClose} title={`${type} जोड़ीं`}>
      <div className="space-y-3">
        <Field
          label="राशि (₹) *"
          value={amount}
          onChange={setAmount}
          placeholder="जइसे: 500"
          type="number"
        />
        <Field label="नोट" value={note} onChange={setNote} placeholder="जइसे: दूध के पइसा" />
        <button
          disabled={!amount || Number(amount) <= 0}
          onClick={() => onSave(Number(amount), note.trim() || undefined)}
          className={`w-full bg-${color}-600 disabled:bg-gray-300 text-white rounded-xl py-3 font-semibold mt-2 active:scale-95 transition`}
        >
          सेव करीं
        </button>
      </div>
    </Modal>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-5 animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 text-xl leading-none px-2">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-600 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </label>
  );
}
