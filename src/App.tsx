import React, { useState, useEffect } from 'react';
import { 
  BahiKhataItem, 
  ExpenseItem, 
  GiftItem, 
  Language, 
  PlantationCrop, 
  ReminderItem, 
  VillageSuperAppState 
} from './types';
import { initialSuperAppState } from './data/initialData';
import { loadStateFromStorage, saveStateToStorage } from './utils/storage';
import { Navbar } from './components/Navbar';
import { TabKey, TabNavigation } from './components/TabNavigation';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ExpensesTab } from './components/ExpensesTab';
import { PlantationTab } from './components/PlantationTab';
import { RemindersTab } from './components/RemindersTab';
import { GiftsTab } from './components/GiftsTab';
import { ToolsTab } from './components/ToolsTab';

// Modals
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { AddCropModal } from './components/modals/AddCropModal';
import { AddFertilizerModal } from './components/modals/AddFertilizerModal';
import { AddSprayModal } from './components/modals/AddSprayModal';
import { AddHarvestModal } from './components/modals/AddHarvestModal';
import { AddReminderModal } from './components/modals/AddReminderModal';
import { AddGiftModal } from './components/modals/AddGiftModal';
import { AddBahiKhataModal } from './components/modals/AddBahiKhataModal';
import { BackupRestoreModal } from './components/modals/BackupRestoreModal';
import { LabelScannerModal, ScannedFertilizerData, ScannedSprayData } from './components/modals/LabelScannerModal';

export default function App() {
  // Global State initialized from localStorage or initial dummy village data
  const [state, setState] = useState<VillageSuperAppState>(() => loadStateFromStorage());
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Modal Open / Close States
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [isAddFertilizerOpen, setIsAddFertilizerOpen] = useState(false);
  const [fertilizerTargetCropId, setFertilizerTargetCropId] = useState<string | undefined>(undefined);
  const [isAddSprayOpen, setIsAddSprayOpen] = useState(false);
  const [sprayTargetCropId, setSprayTargetCropId] = useState<string | undefined>(undefined);
  const [isAddHarvestOpen, setIsAddHarvestOpen] = useState(false);
  const [harvestTargetCropId, setHarvestTargetCropId] = useState<string | undefined>(undefined);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false);
  const [isAddBahiKhataOpen, setIsAddBahiKhataOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Label Scanner & Auto-Fill States
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerTargetCropId, setScannerTargetCropId] = useState<string | undefined>(undefined);
  const [prefilledFertilizerData, setPrefilledFertilizerData] = useState<any>(undefined);
  const [prefilledSprayData, setPrefilledSprayData] = useState<any>(undefined);

  // Sync to localStorage on changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // Language Toggle
  const handleToggleLanguage = () => {
    setState((prev) => ({
      ...prev,
      language: prev.language === 'hi' ? 'en' : 'hi',
    }));
  };

  // 1. EXPENSE HANDLERS
  const handleSaveExpense = (newExp: Omit<ExpenseItem, 'id'>) => {
    const item: ExpenseItem = {
      ...newExp,
      id: `exp-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      expenses: [item, ...prev.expenses],
    }));
  };

  const handleDeleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  };

  // 2. PLANTATION & CROP HANDLERS
  const handleSaveCrop = (newCrop: Omit<PlantationCrop, 'id' | 'fertilizerLogs' | 'sprayLogs' | 'irrigationLogs' | 'harvestRecords'>) => {
    const item: PlantationCrop = {
      ...newCrop,
      id: `crop-${Date.now()}`,
      fertilizerLogs: [],
      sprayLogs: [],
      irrigationLogs: [],
      harvestRecords: [],
    };
    setState((prev) => ({
      ...prev,
      crops: [item, ...prev.crops],
    }));
  };

  const handleDeleteCrop = (id: string) => {
    setState((prev) => ({
      ...prev,
      crops: prev.crops.filter((c) => c.id !== id),
    }));
  };

  const handleSaveFertilizerLog = (cropId: string, log: any, alsoRecordExpense: boolean) => {
    const logItem = {
      ...log,
      id: `fert-${Date.now()}`,
    };

    setState((prev) => {
      const targetCrop = prev.crops.find((c) => c.id === cropId);
      const updatedCrops = prev.crops.map((c) => {
        if (c.id === cropId) {
          return {
            ...c,
            fertilizerLogs: [logItem, ...c.fertilizerLogs],
          };
        }
        return c;
      });

      let updatedExpenses = prev.expenses;
      if (alsoRecordExpense && log.cost && log.cost > 0) {
        const autoExp: ExpenseItem = {
          id: `exp-${Date.now()}`,
          title: `${log.fertilizerType} (${log.quantity} ${log.unit})`,
          amount: log.cost,
          category: 'fertilizer',
          isFarming: true,
          date: log.date,
          cropOrPlot: targetCrop?.plotName,
          quantityUsed: `${log.quantity} ${log.unit}`,
          paymentMode: 'cash',
          notes: `Auto-recorded from Plantation log: ${log.stage}`,
        };
        updatedExpenses = [autoExp, ...prev.expenses];
      }

      return {
        ...prev,
        crops: updatedCrops,
        expenses: updatedExpenses,
      };
    });
  };

  const handleSaveSprayLog = (cropId: string, log: any, alsoRecordExpense: boolean) => {
    const logItem = {
      ...log,
      id: `spray-${Date.now()}`,
    };

    setState((prev) => {
      const targetCrop = prev.crops.find((c) => c.id === cropId);
      const updatedCrops = prev.crops.map((c) => {
        if (c.id === cropId) {
          return {
            ...c,
            sprayLogs: [logItem, ...c.sprayLogs],
          };
        }
        return c;
      });

      let updatedExpenses = prev.expenses;
      if (alsoRecordExpense && log.cost && log.cost > 0) {
        const autoExp: ExpenseItem = {
          id: `exp-${Date.now()}`,
          title: `${log.name} (Spray)`,
          amount: log.cost,
          category: 'pesticide',
          isFarming: true,
          date: log.date,
          cropOrPlot: targetCrop?.plotName,
          paymentMode: 'cash',
          notes: `Purpose: ${log.purpose}`,
        };
        updatedExpenses = [autoExp, ...prev.expenses];
      }

      return {
        ...prev,
        crops: updatedCrops,
        expenses: updatedExpenses,
      };
    });
  };

  const handleSaveHarvest = (cropId: string, harvestRecord: any) => {
    const totalRev = (harvestRecord.yieldAmount || 0) * (harvestRecord.sellingRatePerUnit || 0);
    const item = {
      ...harvestRecord,
      id: `harv-${Date.now()}`,
      totalRevenue: totalRev,
    };

    setState((prev) => ({
      ...prev,
      crops: prev.crops.map((c) => {
        if (c.id === cropId) {
          return {
            ...c,
            status: 'harvested',
            harvestRecords: [item, ...c.harvestRecords],
          };
        }
        return c;
      }),
    }));
  };

  // LABEL SCANNER & AUTO-FILL HANDLERS
  const handleOpenScanner = (cropId?: string) => {
    setScannerTargetCropId(cropId);
    setIsScannerOpen(true);
  };

  const handleAutoFillFertilizer = (cropId: string, data: ScannedFertilizerData) => {
    setFertilizerTargetCropId(cropId);
    setPrefilledFertilizerData(data);
    setIsAddFertilizerOpen(true);
  };

  const handleAutoFillSpray = (cropId: string, data: ScannedSprayData) => {
    setSprayTargetCropId(cropId);
    setPrefilledSprayData(data);
    setIsAddSprayOpen(true);
  };

  // 3. REMINDER HANDLERS
  const handleSaveReminder = (newRem: Omit<ReminderItem, 'id' | 'completed'>) => {
    const item: ReminderItem = {
      ...newRem,
      id: `rem-${Date.now()}`,
      completed: false,
    };
    setState((prev) => ({
      ...prev,
      reminders: [item, ...prev.reminders],
    }));
  };

  const handleToggleReminder = (id: string) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    }));
  };

  const handleDeleteReminder = (id: string) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => r.id !== id),
    }));
  };

  // 4. GIFT HANDLERS
  const handleSaveGift = (newGift: Omit<GiftItem, 'id'>) => {
    const item: GiftItem = {
      ...newGift,
      id: `gift-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      gifts: [item, ...prev.gifts],
    }));
  };

  const handleToggleGiftCounterSettled = (id: string) => {
    setState((prev) => ({
      ...prev,
      gifts: prev.gifts.map((g) => (g.id === id ? { ...g, counterGiftSettled: !g.counterGiftSettled } : g)),
    }));
  };

  const handleDeleteGift = (id: string) => {
    setState((prev) => ({
      ...prev,
      gifts: prev.gifts.filter((g) => g.id !== id),
    }));
  };

  // 5. BAHI KHATA HANDLERS
  const handleSaveBahiKhata = (newItem: Omit<BahiKhataItem, 'id'>) => {
    const item: BahiKhataItem = {
      ...newItem,
      id: `bahi-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      bahiKhata: [item, ...prev.bahiKhata],
    }));
  };

  const handleToggleBahiSettled = (id: string) => {
    setState((prev) => ({
      ...prev,
      bahiKhata: prev.bahiKhata.map((b) => (b.id === id ? { ...b, settled: !b.settled } : b)),
    }));
  };

  const handleDeleteBahiKhata = (id: string) => {
    setState((prev) => ({
      ...prev,
      bahiKhata: prev.bahiKhata.filter((b) => b.id !== id),
    }));
  };

  // 6. BACKUP & RESET
  const handleResetDemoData = () => {
    setState(initialSuperAppState);
  };

  const handleRestoreState = (newState: VillageSuperAppState) => {
    setState(newState);
  };

  return (
    <div id="gramin-village-super-app" className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col antialiased">
      {/* Top Main Navigation Header */}
      <Navbar
        language={state.language}
        pendingRemindersCount={state.reminders.filter((r) => !r.completed).length}
        onToggleLanguage={handleToggleLanguage}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab as TabKey)}
        onResetDemoData={handleResetDemoData}
      />

      {/* Main Container Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
        {/* Navigation Tabs (Desktop & Tablet) */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          language={state.language}
          pendingRemindersCount={state.reminders.filter((r) => !r.completed).length}
        />

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <OverviewDashboard
            state={state}
            onNavigateTab={setActiveTab}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onOpenAddCrop={() => setIsAddCropOpen(true)}
            onOpenAddReminder={() => setIsAddReminderOpen(true)}
            onOpenAddGift={() => setIsAddGiftOpen(true)}
            onToggleReminder={handleToggleReminder}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab
            expenses={state.expenses}
            crops={state.crops}
            onAddExpense={() => setIsAddExpenseOpen(true)}
            onDeleteExpense={handleDeleteExpense}
            language={state.language}
          />
        )}

        {activeTab === 'plantation' && (
          <PlantationTab
            crops={state.crops}
            onAddCrop={() => setIsAddCropOpen(true)}
            onAddFertilizer={(cropId) => {
              setFertilizerTargetCropId(cropId);
              setIsAddFertilizerOpen(true);
            }}
            onAddSpray={(cropId) => {
              setSprayTargetCropId(cropId);
              setIsAddSprayOpen(true);
            }}
            onAddHarvest={(cropId) => {
              setHarvestTargetCropId(cropId);
              setIsAddHarvestOpen(true);
            }}
            onDeleteCrop={handleDeleteCrop}
            onAskAiForCrop={(crop) => {
              setActiveTab('tools');
            }}
            onOpenScanner={handleOpenScanner}
            language={state.language}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersTab
            reminders={state.reminders}
            crops={state.crops}
            onAddReminder={() => setIsAddReminderOpen(true)}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
            language={state.language}
          />
        )}

        {activeTab === 'gifts' && (
          <GiftsTab
            gifts={state.gifts}
            onAddGift={() => setIsAddGiftOpen(true)}
            onToggleCounterSettled={handleToggleGiftCounterSettled}
            onDeleteGift={handleDeleteGift}
            language={state.language}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsTab
            state={state}
            onAddBahiKhata={() => setIsAddBahiKhataOpen(true)}
            onToggleBahiSettled={handleToggleBahiSettled}
            onDeleteBahiKhata={handleDeleteBahiKhata}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            language={state.language}
          />
        )}
      </main>

      {/* Floating Bottom Navigation for Mobile Screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { key: 'overview', icon: '🏠', label: state.language === 'hi' ? 'होम' : 'Home' },
          { key: 'expenses', icon: '💰', label: state.language === 'hi' ? 'खर्चा' : 'Expenses' },
          { key: 'plantation', icon: '🌱', label: state.language === 'hi' ? 'खेत-फसल' : 'Crops' },
          { key: 'reminders', icon: '⏰', label: state.language === 'hi' ? 'अलर्ट' : 'Alerts' },
          { key: 'gifts', icon: '🎁', label: state.language === 'hi' ? 'शगुन' : 'Shagun' },
          { key: 'tools', icon: '🛠️', label: state.language === 'hi' ? 'टूल्स' : 'Tools' },
        ].map((item) => {
          const isSel = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key as TabKey)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                isSel ? 'text-emerald-800 font-bold' : 'text-neutral-500 font-medium'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODAL DIALOGS */}
      {/* 1. Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        crops={state.crops}
        onSave={handleSaveExpense}
        language={state.language}
      />

      {/* 2. Add Crop / Plot Modal */}
      <AddCropModal
        isOpen={isAddCropOpen}
        onClose={() => setIsAddCropOpen(false)}
        onSave={handleSaveCrop}
        language={state.language}
      />

      {/* 3. Add Fertilizer Application Log Modal */}
      <AddFertilizerModal
        isOpen={isAddFertilizerOpen}
        onClose={() => {
          setIsAddFertilizerOpen(false);
          setFertilizerTargetCropId(undefined);
          setPrefilledFertilizerData(undefined);
        }}
        crops={state.crops}
        selectedCropId={fertilizerTargetCropId}
        initialData={prefilledFertilizerData}
        onSave={handleSaveFertilizerLog}
        language={state.language}
      />

      {/* 4. Add Spray / Pesticide Modal */}
      <AddSprayModal
        isOpen={isAddSprayOpen}
        onClose={() => {
          setIsAddSprayOpen(false);
          setSprayTargetCropId(undefined);
          setPrefilledSprayData(undefined);
        }}
        crops={state.crops}
        selectedCropId={sprayTargetCropId}
        initialData={prefilledSprayData}
        onSave={handleSaveSprayLog}
        language={state.language}
      />

      {/* 5. Add Harvest Record Modal */}
      <AddHarvestModal
        isOpen={isAddHarvestOpen}
        onClose={() => {
          setIsAddHarvestOpen(false);
          setHarvestTargetCropId(undefined);
        }}
        crops={state.crops}
        selectedCropId={harvestTargetCropId}
        onSave={handleSaveHarvest}
        language={state.language}
      />

      {/* 6. Add Reminder Modal */}
      <AddReminderModal
        isOpen={isAddReminderOpen}
        onClose={() => setIsAddReminderOpen(false)}
        crops={state.crops}
        onSave={handleSaveReminder}
        language={state.language}
      />

      {/* 7. Add Gift / Shagun Modal */}
      <AddGiftModal
        isOpen={isAddGiftOpen}
        onClose={() => setIsAddGiftOpen(false)}
        onSave={handleSaveGift}
        language={state.language}
      />

      {/* 8. Add Bahi Khata Entry Modal */}
      <AddBahiKhataModal
        isOpen={isAddBahiKhataOpen}
        onClose={() => setIsAddBahiKhataOpen(false)}
        onSave={handleSaveBahiKhata}
        language={state.language}
      />

      {/* 9. Backup & Restore Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        state={state}
        onRestore={handleRestoreState}
        onResetDemo={handleResetDemoData}
        language={state.language}
      />

      {/* 10. AI Smart Camera Label Scanner Modal */}
      <LabelScannerModal
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          setScannerTargetCropId(undefined);
        }}
        crops={state.crops}
        selectedCropId={scannerTargetCropId}
        onAutoFillFertilizer={handleAutoFillFertilizer}
        onAutoFillSpray={handleAutoFillSpray}
        language={state.language}
      />
    </div>
  );
}
