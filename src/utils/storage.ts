import { VillageSuperAppState, ExpenseItem, GiftItem, PlantationCrop } from '../types';
import { INITIAL_STATE } from '../data/initialData';

const STORAGE_KEY = 'gramin_super_app_data_v1';

export function loadAppState(): VillageSuperAppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveAppState(INITIAL_STATE);
      return INITIAL_STATE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
      language: parsed.language === 'hi' ? 'hi' : 'en',
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : INITIAL_STATE.expenses,
      crops: Array.isArray(parsed.crops) ? parsed.crops : INITIAL_STATE.crops,
      reminders: Array.isArray(parsed.reminders) ? parsed.reminders : INITIAL_STATE.reminders,
      gifts: Array.isArray(parsed.gifts) ? parsed.gifts : INITIAL_STATE.gifts,
      bahiKhata: Array.isArray(parsed.bahiKhata) ? parsed.bahiKhata : INITIAL_STATE.bahiKhata,
      mandiPrices: Array.isArray(parsed.mandiPrices) && parsed.mandiPrices.length > 0 ? parsed.mandiPrices : INITIAL_STATE.mandiPrices,
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return INITIAL_STATE;
  }
}

export function saveAppState(state: VillageSuperAppState): void {
  try {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export const loadStateFromStorage = loadAppState;
export const saveStateToStorage = saveAppState;

export function exportStateToJson(state: VillageSuperAppState): void {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gramin_village_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function safeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  // Prevent CSV Formula Injection (DDE injection in Excel/Sheets)
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export function exportExpensesToCSV(expenses: ExpenseItem[]): void {
  const headers = ['ID', 'Title', 'Category', 'Amount (INR)', 'Date', 'Type', 'Payment Mode', 'Quantity/Details', 'Crop/Field', 'Notes'];
  const rows = (expenses || []).map(e => [
    safeCsvCell(e.id),
    safeCsvCell(e.title),
    safeCsvCell(e.category),
    Number(e.amount) || 0,
    safeCsvCell(e.date),
    e.isFarming ? '"Farming"' : '"Daily Living"',
    safeCsvCell(e.paymentMode),
    safeCsvCell(e.quantityUsed),
    safeCsvCell(e.cropOrPlot),
    safeCsvCell(e.notes)
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gramin_expenses_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportGiftsToCSV(gifts: GiftItem[]): void {
  const headers = ['ID', 'Type', 'Person Name', 'Village / Relation', 'Occasion', 'Date', 'Category', 'Amount / Value (INR)', 'Description', 'Return Settled', 'Counter Details'];
  const rows = (gifts || []).map(g => [
    safeCsvCell(g.id),
    safeCsvCell(g.type === 'received' ? 'Received (Aaya)' : 'Given (Diya)'),
    safeCsvCell(g.personName),
    safeCsvCell(g.villageOrRelation),
    safeCsvCell(g.occasion),
    safeCsvCell(g.date),
    safeCsvCell(g.giftCategory),
    Number(g.amountOrValue) || 0,
    safeCsvCell(g.itemDescription),
    g.counterGiftSettled ? '"Yes"' : '"No"',
    safeCsvCell(g.counterGiftDetails)
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gramin_shagun_gifts_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
