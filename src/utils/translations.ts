import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  nav: {
    overview: string;
    expenses: string;
    plantation: string;
    reminders: string;
    gifts: string;
    tools: string;
  };
  overview: {
    title: string;
    subtitle: string;
    totalFarmingExpense: string;
    totalDailyExpense: string;
    activePlots: string;
    pendingReminders: string;
    netGiftsReceived: string;
    quickAddExpense: string;
    quickAddCrop: string;
    quickAddReminder: string;
    quickAddGift: string;
    recentActivities: string;
    viewAll: string;
    weatherCardTitle: string;
    weatherSeason: string;
    weatherAdvice: string;
  };
  expenses: {
    title: string;
    subtitle: string;
    all: string;
    farmingOnly: string;
    dailyOnly: string;
    fertilizerOnly: string;
    addNewExpense: string;
    searchPlaceholder: string;
    category: string;
    amount: string;
    date: string;
    paymentMode: string;
    quantity: string;
    cropOrField: string;
    notes: string;
    categories: {
      fertilizer: string;
      seeds: string;
      pesticide: string;
      diesel_tractor: string;
      labor: string;
      irrigation: string;
      groceries: string;
      household: string;
      medical: string;
      education: string;
      electricity_bills: string;
      livestock_fodder: string;
      other: string;
    };
    totalExpenses: string;
    farmingShare: string;
    dailyShare: string;
    exportCSV: string;
  };
  plantation: {
    title: string;
    subtitle: string;
    addNewPlot: string;
    logFertilizer: string;
    logSpray: string;
    logIrrigation: string;
    logHarvest: string;
    plotName: string;
    cropName: string;
    variety: string;
    area: string;
    soilType: string;
    plantingDate: string;
    expectedHarvest: string;
    status: string;
    fertilizerAppliedTotal: string;
    totalInvestment: string;
    harvestRevenue: string;
    profit: string;
    generateAISchedule: string;
    stage: string;
    action: string;
  };
  reminders: {
    title: string;
    subtitle: string;
    addNewReminder: string;
    overdue: string;
    today: string;
    upcoming: string;
    completed: string;
    markDone: string;
    snooze: string;
    highPriority: string;
    mediumPriority: string;
    lowPriority: string;
    dueDate: string;
    time: string;
  };
  gifts: {
    title: string;
    subtitle: string;
    addNewGift: string;
    receivedTab: string;
    givenTab: string;
    allTab: string;
    totalReceived: string;
    totalGiven: string;
    netBalance: string;
    personName: string;
    villageOrRelation: string;
    occasion: string;
    giftType: string;
    amountValue: string;
    returnStatus: string;
    settled: string;
    pendingReturn: string;
    markSettled: string;
  };
  tools: {
    title: string;
    subtitle: string;
    areaConverter: string;
    fertilizerCalculator: string;
    seedRateCalculator: string;
    mandiCalculator: string;
    bahiKhata: string;
    aiAssistant: string;
    convert: string;
    calculate: string;
    result: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    confirm: string;
    filter: string;
    search: string;
    backupData: string;
    restoreData: string;
    resetDemoData: string;
    voiceInput: string;
    listening: string;
    success: string;
    helpline: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "Gramin Super App",
    tagline: "Kisan & Village Smart Companion",
    nav: {
      overview: "Overview",
      expenses: "Expenses (Kharcha)",
      plantation: "Farm & Crops (Kheti)",
      reminders: "Reminders (Yaad)",
      gifts: "Gifts & Shagun (Nyota)",
      tools: "Super Tools",
    },
    overview: {
      title: "Village Community & Farm Hub",
      subtitle: "Effortlessly manage farm investments, daily household costs, crop nutrition logs, and family social occasions.",
      totalFarmingExpense: "Total Farming Costs",
      totalDailyExpense: "Total Daily Expenses",
      activePlots: "Active Farm Crops",
      pendingReminders: "Pending Tasks",
      netGiftsReceived: "Total Gifts / Shagun",
      quickAddExpense: "Log Expense",
      quickAddCrop: "Add Crop / Plot",
      quickAddReminder: "New Reminder",
      quickAddGift: "Record Shagun / Gift",
      recentActivities: "Recent Village & Farm Activity",
      viewAll: "View Details",
      weatherCardTitle: "Weather & Farm Advisory",
      weatherSeason: "Monsoon / Kharif Season",
      weatherAdvice: "Ideal time for Urea top dressing after rain and monitoring drainage in low-lying fields.",
    },
    expenses: {
      title: "Expense Tracker (Kharcha)",
      subtitle: "Track every rupee spent on farming inputs (fertilizer, seeds, diesel, labor) and daily household groceries.",
      all: "All Expenses",
      farmingOnly: "🌾 Farming & Crops",
      dailyOnly: "🛒 Daily & Groceries",
      fertilizerOnly: "🧪 Fertilizers & Nutrients",
      addNewExpense: "Record New Expense",
      searchPlaceholder: "Search expenses (e.g., Urea, Groceries, Diesel, Seeds)...",
      category: "Category",
      amount: "Amount",
      date: "Date",
      paymentMode: "Payment Mode",
      quantity: "Quantity / Details",
      cropOrField: "Associated Crop / Field",
      notes: "Notes / Dealer Name",
      categories: {
        fertilizer: "Fertilizer & Nutrition (Khad)",
        seeds: "Seeds (Beej)",
        pesticide: "Pesticide & Spray (Dawai)",
        diesel_tractor: "Tractor & Diesel (Tractor/Tel)",
        labor: "Farm Labor (Majdoori)",
        irrigation: "Irrigation & Water (Pani/Sinchaai)",
        groceries: "Groceries & Ration (Ration/Kirana)",
        household: "Household Needs (Ghar Kharch)",
        medical: "Health & Medicines (Dawakhana)",
        education: "School & Education (Padhai)",
        electricity_bills: "Electricity & Bills (Bijli Bill)",
        livestock_fodder: "Cattle & Fodder (Pashu Aahar)",
        other: "Other Village Expenses (Anya)",
      },
      totalExpenses: "Total Recorded Expenses",
      farmingShare: "Farming Investments",
      dailyShare: "Daily Living Costs",
      exportCSV: "Download Expense Sheet (CSV)",
    },
    plantation: {
      title: "Plantation & Fertilizer Management",
      subtitle: "Record which crop was sown, track fertilizer dosage (Urea, DAP, NPK), pesticide sprays, irrigation, and harvest profit.",
      addNewPlot: "Register New Crop / Plot",
      logFertilizer: "+ Log Fertilizer Application",
      logSpray: "+ Log Spraying",
      logIrrigation: "+ Log Irrigation",
      logHarvest: "+ Record Harvest Sale",
      plotName: "Plot / Field Name",
      cropName: "Crop Name",
      variety: "Variety / Seed Type",
      area: "Field Area",
      soilType: "Soil Type",
      plantingDate: "Sowing / Planting Date",
      expectedHarvest: "Expected Harvest Date",
      status: "Crop Growth Stage",
      fertilizerAppliedTotal: "Fertilizer Applied",
      totalInvestment: "Total Field Cost",
      harvestRevenue: "Harvest Yield Revenue",
      profit: "Net Farm Profit",
      generateAISchedule: "Generate AI Crop Schedule",
      stage: "Growth Stage",
      action: "Recommended Activity",
    },
    reminders: {
      title: "Smart Village Reminder System",
      subtitle: "Never miss fertilizer application due dates, pesticide spray cycles, tubewell bills, KCC loan EMI, or returning wedding shagun.",
      addNewReminder: "Create Reminder",
      overdue: "Overdue",
      today: "Due Today",
      upcoming: "Upcoming",
      completed: "Completed History",
      markDone: "Mark Complete",
      snooze: "Snooze 1 Day",
      highPriority: "High Priority",
      mediumPriority: "Normal",
      lowPriority: "Low Priority",
      dueDate: "Due Date",
      time: "Scheduled Time",
    },
    gifts: {
      title: "Shagun & Gift Registry (Nyota / Bahi)",
      subtitle: "Cultural record of gifts given and received at weddings (Daughter's marriage, Kanyadan, Bhat), Griha Pravesh, and ceremonies with counter-gift return tracker.",
      addNewGift: "Record Gift / Shagun",
      receivedTab: "📥 Shagun Received (Aaya Shagun)",
      givenTab: "📤 Shagun Given (Diya Shagun)",
      allTab: "All Transactions",
      totalReceived: "Total Shagun Received",
      totalGiven: "Total Shagun Given",
      netBalance: "Social Gifting Balance",
      personName: "Person / Family Name",
      villageOrRelation: "Village / Relation",
      occasion: "Occasion / Event",
      giftType: "Gift Category",
      amountValue: "Amount / Value (₹)",
      returnStatus: "Return Status (Loutana)",
      settled: "Reciprocated / Settled",
      pendingReturn: "Pending Return (Loutana Baki)",
      markSettled: "Mark Reciprocated",
    },
    tools: {
      title: "Super Tools & Village Calculators",
      subtitle: "All-in-one suite of rural utilities: Land area unit converter, fertilizer NPK dosage guide, MSP mandi calculator, Bahi Khata, and Kisan AI Sahayak.",
      areaConverter: "Land Area Converter",
      fertilizerCalculator: "Fertilizer NPK Dosage Calculator",
      seedRateCalculator: "Seed Rate Estimator",
      mandiCalculator: "Crop Selling & Mandi MSP Calculator",
      bahiKhata: "Village Udhaar / Bahi Khata",
      aiAssistant: "Kisan AI Sahayak (Advisor)",
      convert: "Convert Units",
      calculate: "Calculate Exact Dose",
      result: "Calculated Summary",
    },
    common: {
      save: "Save Details",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      confirm: "Confirm",
      filter: "Filter",
      search: "Search...",
      backupData: "Backup Data",
      restoreData: "Restore Data",
      resetDemoData: "Reset Sample Data",
      voiceInput: "Tap to Speak (Voice Entry)",
      listening: "Listening... speak clearly",
      success: "Successfully saved!",
      helpline: "Kisan Call Center: 1800-180-1551 (Toll-Free)",
    },
  },

  hi: {
    appName: "ग्रामीण सुपर ऐप",
    tagline: "किसान व ग्रामीण भाइयों का सच्चा साथी",
    nav: {
      overview: "होम (मुख्य पृष्ठ)",
      expenses: "खर्चा (हिसाब-किताब)",
      plantation: "खेती व खाद (फसल)",
      reminders: "याद-दहानी (अलर्ट)",
      gifts: "शगुन व न्योता (लेन-देन)",
      tools: "ग्रामीण टूल्स",
    },
    overview: {
      title: "ग्रामीण व किसान सेवा केंद्र",
      subtitle: "खेती-बाड़ी की लागत, दैनिक घरेलू खर्च, खाद-दवाई का हिसाब और शादी-विवाह के शगुन का पूरा रिकॉर्ड रखें।",
      totalFarmingExpense: "खेती की कुल लागत",
      totalDailyExpense: "दैनिक घरेलू खर्च",
      activePlots: "कुल चालू फसलें / खेत",
      pendingReminders: "ज़रूरी काम (रिमाइंडर)",
      netGiftsReceived: "कुल शगुन / न्योता रिकॉर्ड",
      quickAddExpense: "नया खर्चा जोड़ें",
      quickAddCrop: "नई फसल / खेत जोड़ें",
      quickAddReminder: "नया रिमाइंडर लगाएं",
      quickAddGift: "शगुन / न्योता दर्ज करें",
      recentActivities: "हाल की गतिविधियां",
      viewAll: "सभी देखें",
      weatherCardTitle: "मौसम व कृषि सलाह",
      weatherSeason: "वर्तमान कृषि मौसम (खरीफ/रबी)",
      weatherAdvice: "सिंचाई के बाद यूरिया की उचित मात्रा डालें और खेत में जल निकासी की व्यवस्था बनाए रखें।",
    },
    expenses: {
      title: "दैनिक व कृषि खर्चा रजिस्टर",
      subtitle: "खाद, बीज, ट्रैक्टर डीजल, मजदूरी और राशन-किराना के हर एक रुपये का स्पष्ट लेखा-जोखा।",
      all: "सभी खर्चे",
      farmingOnly: "🌾 केवल खेती-बाड़ी",
      dailyOnly: "🛒 केवल राशन व घरेलू",
      fertilizerOnly: "🧪 केवल खाद व उर्वरक",
      addNewExpense: "नया खर्चा दर्ज करें",
      searchPlaceholder: "खर्चा खोजें (यूरिया, राशन, बीज, डीजल)...",
      category: "खर्च की श्रेणी",
      amount: "रुपये (राशि)",
      date: "दिनांक",
      paymentMode: "भुगतान का माध्यम (नकद/UPI)",
      quantity: "मात्रा (बोरी/लीटर/किलो)",
      cropOrField: "संबंधित खेत / फसल",
      notes: "विवरण / दुकानदार का नाम",
      categories: {
        fertilizer: "खाद व उर्वरक (यूरिया/DAP)",
        seeds: "बीज (Beej)",
        pesticide: "कीटनाशक व दवाई (Spray)",
        diesel_tractor: "ट्रैक्टर जुताई व डीजल",
        labor: "मजदूरी व निराई (Labor)",
        irrigation: "सिंचाई व ट्यूबवेल का खर्च",
        groceries: "राशन व किराना (Groceries)",
        household: "घरेलू सामान (Household)",
        medical: "दवाई व स्वास्थ्य (Medical)",
        education: "बच्चों की पढ़ाई व फीस",
        electricity_bills: "बिजली बिल व अन्य बिल",
        livestock_fodder: "पशु आहार व खल-चूनी",
        other: "अन्य ग्रामीण खर्चे",
      },
      totalExpenses: "कुल दर्ज खर्चा",
      farmingShare: "खेती में लगा पैसा",
      dailyShare: "घर-गृहस्थी का खर्च",
      exportCSV: "खर्च पर्ची डाउनलोड करें (CSV)",
    },
    plantation: {
      title: "फसल बुवाई व खाद प्रबंधन",
      subtitle: "कौन सा पौधा/बीज कब बोया, कब-कितनी खाद डाली, कीटनाशक छिड़काव और कटाई का मुनाफा दर्ज करें।",
      addNewPlot: "नया खेत / फसल जोड़ें",
      logFertilizer: "+ खाद डालने का रिकॉर्ड दर्ज करें",
      logSpray: "+ कीटनाशक स्प्रे रिकॉर्ड",
      logIrrigation: "+ सिंचाई का समय",
      logHarvest: "+ फसल कटाई व उपज बिक्री",
      plotName: "खेत / चक का नाम",
      cropName: "फसल का नाम (गेहूं/सरसों/आलू)",
      variety: "किस्म / बीज ब्रांड",
      area: "खेत का क्षेत्रफल (बीघा/एकड़)",
      soilType: "मिट्टी का प्रकार",
      plantingDate: "बुवाई की तारीख",
      expectedHarvest: "कटाई की संभावित तारीख",
      status: "फसल की अवस्था",
      fertilizerAppliedTotal: "कुल दी गई खाद",
      totalInvestment: "खेत की कुल लागत",
      harvestRevenue: "उपज बिक्री से आय",
      profit: "शुद्ध मुनाफा",
      generateAISchedule: "AI फसल समय-सारणी बनाएं",
      stage: "फसल की अवस्था",
      action: "सुझाया गया कार्य",
    },
    reminders: {
      title: "ग्रामीण याद-दहानी (अलर्ट सिस्टम)",
      subtitle: "खाद डालने की तारीख, स्प्रे का समय, ट्यूबवेल का बिल, KCC लोन की किस्त और शादी का शगुन लौटाने का रिमाइंडर।",
      addNewReminder: "नया रिमाइंडर लगाएं",
      overdue: "तारीख निकल चुकी है",
      today: "आज का काम",
      upcoming: "आगामी दिन",
      completed: "पूर्ण हो चुके कार्य",
      markDone: "पूरा हो गया (Done)",
      snooze: "कल के लिए टालें (Snooze)",
      highPriority: "अति आवश्यक (High)",
      mediumPriority: "सामान्य (Normal)",
      lowPriority: "कम जरूरी (Low)",
      dueDate: "नियत तारीख",
      time: "नियत समय",
    },
    gifts: {
      title: "शगुन व न्योता बही (लेन-देन रजिस्टर)",
      subtitle: "बेटी की शादी (कन्यादान/भात), बेटे का विवाह, गृह प्रवेश और मुंडन में किसने कितना शगुन दिया और किसे कब लौटाना है।",
      addNewGift: "शगुन / न्योता दर्ज करें",
      receivedTab: "📥 आया हुआ शगुन (Received)",
      givenTab: "📤 दिया हुआ शगुन (Given)",
      allTab: "कुल हिसाब-किताब",
      totalReceived: "कुल प्राप्त शगुन",
      totalGiven: "कुल दिया गया शगुन",
      netBalance: "शगुन का सामाजिक संतुलन",
      personName: "व्यक्ति / परिवार का नाम",
      villageOrRelation: "गाँव / रिश्तेदारी",
      occasion: "शुभ अवसर (बेटी की शादी आदि)",
      giftType: "उपहार का प्रकार",
      amountValue: "रुपये / मूल्य (₹)",
      returnStatus: "लौटाने की स्थिति (Status)",
      settled: "लौटा दिया (Reciprocated)",
      pendingReturn: "लौटाना शेष है (Pending)",
      markSettled: "लौटा दिया चिह्नित करें",
    },
    tools: {
      title: "ग्रामीण सुपर टूल्स व कैलकुलेटर",
      subtitle: "जमीन नापने का यंत्र (बीघा/एकड़), खाद की सही मात्रा, मंडी भाव कैलकुलेटर, बही-खाता और किसान AI सहायक।",
      areaConverter: "जमीन नाप परिवर्तक (बीघा / एकड़ / हेक्टेयर)",
      fertilizerCalculator: "खाद मात्रा कैलकुलेटर (NPK/यूरिया)",
      seedRateCalculator: "बीज दर कैलकुलेटर",
      mandiCalculator: "मंडी भाव व उपज बिक्री कैलकुलेटर",
      bahiKhata: "ग्रामीण उधारी / बही-खाता (Khata)",
      aiAssistant: "किसान AI सहायक (फसल डॉक्टर)",
      convert: "परिवर्तित करें",
      calculate: "मात्रा निकालें",
      result: "गणना परिणाम",
    },
    common: {
      save: "सुरक्षित करें (Save)",
      cancel: "रद्द करें",
      delete: "हटाएं",
      edit: "बदलें (Edit)",
      close: "बंद करें",
      confirm: "पुष्टि करें",
      filter: "फ़िल्टर",
      search: "खोजें...",
      backupData: "डेटा बैकअप लें",
      restoreData: "डेटा रीस्टोर करें",
      resetDemoData: "नमूना डेटा लोड करें",
      voiceInput: "बोलकर दर्ज करें (आवाज इनपुट)",
      listening: "सुन रहे हैं... बोलिए",
      success: "सफलतापूर्वक सुरक्षित हुआ!",
      helpline: "किसान कॉल सेंटर: 1800-180-1551 (टोल-फ्री)",
    },
  },
};
