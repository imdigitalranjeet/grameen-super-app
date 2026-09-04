export type Language = 'en' | 'hi';

export type ExpenseCategory = 
  | 'fertilizer'
  | 'seeds'
  | 'pesticide'
  | 'diesel_tractor'
  | 'labor'
  | 'irrigation'
  | 'groceries'
  | 'household'
  | 'medical'
  | 'education'
  | 'electricity_bills'
  | 'livestock_fodder'
  | 'other';

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  isFarming: boolean;
  paymentMode: 'cash' | 'upi' | 'credit' | 'bank_transfer';
  cropOrPlot?: string;
  quantityUsed?: string; // e.g. "2 Bags Urea", "15 Liters Diesel", "5 kg Aata"
  notes?: string;
  tags?: string[];
}

export interface FertilizerLog {
  id: string;
  date: string;
  fertilizerType: string; // e.g., Urea, DAP, NPK 19:19:19, Potash (MOP), Zinc, Organic Vermicompost
  quantity: number;
  unit: 'kg' | 'bags' | 'quintal' | 'liters';
  cost: number;
  applicationMethod: 'Broadcasting' | 'Drip/Fertigation' | 'Foliar Spray' | 'Basal Application';
  stage: string; // e.g. "Basal Sowing", "First Top Dressing (21 Days)", "Tillering", "Flowering"
  notes?: string;
}

export interface SprayLog {
  id: string;
  date: string;
  name: string; // Chemical/Organic pesticide/fungicide/micronutrient
  purpose: string; // e.g., "Aphid control", "Blight protection", "Growth promoter"
  cost: number;
}

export interface IrrigationLog {
  id: string;
  date: string;
  source: 'Tubewell / Borewell' | 'Canal' | 'Rainfed' | 'Drip / Sprinkler';
  hours: number;
  electricityOrDieselCost: number;
}

export interface HarvestRecord {
  id: string;
  date: string;
  yieldAmount: number;
  unit: 'Quintal' | 'Kg' | 'Bags' | 'Tons' | 'Mann';
  sellingRatePerUnit: number; // e.g. ₹2275 per Quintal (MSP)
  totalRevenue: number;
  buyerOrMandi: string;
  notes?: string;
}

export interface PlantationCrop {
  id: string;
  plotName: string;
  areaValue: number;
  areaUnit: 'Acre' | 'Bigha' | 'Hectare' | 'Guntha';
  soilType: string;
  cropName: string;
  variety?: string;
  plantingDate: string;
  expectedHarvestDate: string;
  status: 'sown' | 'growing' | 'flowering' | 'harvest_ready' | 'harvested';
  fertilizerLogs: FertilizerLog[];
  sprayLogs: SprayLog[];
  irrigationLogs: IrrigationLog[];
  harvestRecords: HarvestRecord[];
  notes?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  category: 
    | 'fertilizer_due'
    | 'spray_due'
    | 'irrigation_due'
    | 'kcc_loan_emi'
    | 'electricity_bill'
    | 'seeds_booking'
    | 'gram_sabha'
    | 'gift_return'
    | 'mandi_sale'
    | 'general';
  dueDate: string;
  dueTime?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  notes?: string;
  recurring?: 'none' | 'weekly' | 'monthly' | 'seasonal';
  relatedPlotOrCrop?: string;
}

export interface GiftItem {
  id: string;
  type: 'given' | 'received';
  personName: string;
  villageOrRelation: string;
  occasion: 
    | 'Daughter Wedding / Kanyadan'
    | 'Son Wedding / Barat'
    | 'Housewarming / Griha Pravesh'
    | 'Mundan / Baby Shower'
    | 'Festival / Diwali / Holi / Eid'
    | 'Anniversary / Birthday'
    | 'Retirement'
    | 'Other Social Event';
  date: string;
  giftCategory: 'cash' | 'gold_silver' | 'utensils' | 'clothes' | 'livestock' | 'other';
  amountOrValue: number;
  itemDescription?: string; // e.g. "₹5,100 Cash + 1 Silver Coin (10g)"
  counterGiftSettled: boolean;
  counterGiftDetails?: string; // e.g. "Returned ₹5,100 at their nephew's wedding on 12/03/2026"
  notes?: string;
}

export interface BahiKhataItem {
  id: string;
  personName: string;
  phone?: string;
  type: 'you_gave' | 'you_took'; // you gave loan or you took credit
  amount: number;
  date: string;
  dueDate?: string;
  settled: boolean;
  purpose: string; // e.g. "Tractor rent pending", "Groceries at Gupta Kirana"
  notes?: string;
}

export interface MandiPrice {
  id: string;
  crop: string;
  marketName: string;
  modalPrice: number; // in INR per quintal
  mspRate: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface WeatherGroundingSource {
  title: string;
  uri: string;
}

export interface DayForecast {
  day: string;
  date: string;
  condition: string;
  tempMax: number;
  tempMin: number;
  rainProb: string | number;
  humidity?: string;
  wind?: string;
  farmAdvice: string;
  suitability?: {
    spraying?: 'favorable' | 'caution' | 'unfavorable';
    irrigation?: 'recommended' | 'not_needed' | 'pause';
    harvesting?: 'good' | 'risky';
  };
}

export interface WeatherForecastData {
  location: string;
  asOf: string;
  overview: string;
  farmPlanningSummary: string;
  forecast: DayForecast[];
  sources?: WeatherGroundingSource[];
  isFallback?: boolean;
}

export interface VillageSuperAppState {
  expenses: ExpenseItem[];
  crops: PlantationCrop[];
  reminders: ReminderItem[];
  gifts: GiftItem[];
  bahiKhata: BahiKhataItem[];
  mandiPrices: MandiPrice[];
  currency: string;
  language: Language;
}

