# 🌾 Gramin: Village Super App (ग्रामीण सुपर ऐप)

> An all-in-one digital companion designed specifically for Indian rural households and farming communities. Manage agricultural & household expenses, monitor crop lifecycles, maintain the traditional Shagun/Bahi-Khata ledger, track critical village reminders, and access live 7-day weather forecasts grounded by Google Search.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-22c55e)](https://recharts.org/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini_API-3.8_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. 7-Day Agricultural Weather Forecast (Google Search Grounded)](#1-7-day-agricultural-weather-forecast-google-search-grounded)
  - [2. Expenses & Farm Economics Tracker (हिसाब-किताब)](#2-expenses--farm-economics-tracker-हिसाब-किताब)
  - [3. Crop Lifecycle & Plantation Management (फसल चक्र)](#3-crop-lifecycle--plantation-management-फसल-चक्र)
  - [4. Shagun & Bahi-Khata Ceremony Ledger (शगुन व न्योता)](#4-shagun--bahi-khata-ceremony-ledger-शगुन-व-न्योता)
  - [5. Village Reminders & Task Alarms (याद दिलाना)](#5-village-reminders--task-alarms-याद-दिलाना)
  - [6. Kisan AI Agronomy Advisor & Tools (किसान सहायक)](#6-kisan-ai-agronomy-advisor--tools-किसान-सहायक)
  - [7. Bilingual & Offline-Ready Data Management](#7-bilingual--offline-ready-data-management)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [API Endpoints](#-api-endpoints)
- [Design & Accessibility Principles](#-design--accessibility-principles)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Rural families and farmers often juggle diverse financial and operational streams—from agricultural inputs (fertilizers, diesel, seeds, labor wages) to household grocery bills, crop harvest schedules, government loan deadlines, and cultural occasion gifts (shagun/nyota). Traditionally, these records are either scattered across pocket paper notebooks (*Bahi-Khata*) or forgotten.

**Gramin** unifies these daily village needs into a single, intuitive, bilingual (Hindi/English) web application with voice input, real-time visual analytics, and live meteorological insights tailored for field planning.

---

## 🚀 Key Features

### 1. 7-Day Agricultural Weather Forecast (Google Search Grounded)
- **Live Search Grounding**: Fetches up-to-date meteorological data via Google Gemini 3.8 Flash grounded with Google Search, complete with verified source citations.
- **Agronomic Operation Suitability Windows**: Provides day-by-day actionability ratings for:
  - 🧪 **Spraying**: Evaluates rain wash-off risks and wind speeds before applying pesticides or foliar nutrients.
  - 💧 **Irrigation**: Guides farmers on whether to run tubewell/canal pumps or pause to conserve electricity and avoid waterlogging.
  - 🌾 **Harvesting & Threshing**: Identifies safe, sunny windows for field harvesting and crop drying.
- **Location Detection & Presets**: Includes one-click GPS geolocation detection, search by village/district, and regional presets (Indore, Karnal, Nashik, Varanasi, Ludhiana).
- **Resilient Caching**: Features server-side in-memory caching to optimize response times and prevent API quota exhaustion.

### 2. Expenses & Farm Economics Tracker (हिसाब-किताब)
- **Granular Categories**: Differentiates between **Farming** (*Fertilizer, Labor, Seeds, Pesticides, Diesel/Tractor, Irrigation, Livestock Fodder*) and **Daily Living** (*Groceries, Household, Medical, Education, Electricity Bills*).
- **Interactive Recharts Donut Pie Chart**:
  - Live proportion breakdown by category with rupee amounts and percentage shares.
  - Dynamic center summary displaying category totals on hover.
  - Quick-scope toggle: **All Expenses**, **Farming Only (🌾)**, and **Household Only (🛒)**.
  - Single-click interactive slice drill-down to filter expense lists.
- **Voice Input**: Integrated speech recognition for hands-free expense entry in Hindi and English.
- **Export**: Instant CSV export for offline records, bank submissions, or tax purposes.

### 3. Crop Lifecycle & Plantation Management (फसल चक्र)
- **Field & Plot Records**: Log active and harvested crops (Wheat, Paddy, Mustard, Soybean, Sugarcane, Cotton, Vegetables) with plot names and acreage.
- **Event Logging**: Record dates, quantities, and costs for:
  - Fertilizer top-dressing (Urea, DAP, MOP, Zinc).
  - Pest and fungicide sprays with dilution ratios.
  - Irrigation dates.
- **Harvest & Profit Analysis**: Calculates net farm yield (in quintals), gross market earnings, total crop expenses, and net profit per acre.
- **AI Crop Schedule Generator**: Generates customized stage-by-stage agronomic management calendars.

### 4. Shagun & Bahi-Khata Ceremony Ledger (शगुन व न्योता)
- **Traditional Reciprocal Ledger**: Digitizes the traditional notebook used in Indian family ceremonies (Weddings, Kuan Pujan/Baby Showers, Griha Pravesh, Mundan, Festivals).
- **Dual Flow**: Tracks both **Received (शगुन आया)** and **Given (शगुन दिया)** transactions.
- **Item & Cash Tracking**: Supports monetary gifts as well as physical offerings (silver coins, sweets, utensils, gold, textiles).
- **Reciprocal Balance Ledger**: Quickly search by family or village name to view past gifting history, ensuring social etiquette and reciprocal giving are honored accurately.

### 5. Village Reminders & Task Alarms (याद दिलाना)
- **Agricultural Timers**: Tubewell electricity supply shifts (day/night power rostering), canal water turns (*Nehar ki Baari*), pesticide spray intervals.
- **Financial Deadlines**: Kisan Credit Card (KCC) loan renewals, electricity bill due dates, cooperative society meetings, Mandi auction days.
- **Priority Indicators**: Flag tasks as Urgent, High, Medium, or Low with one-click completion toggles.

### 6. Kisan AI Agronomy Advisor & Tools (किसान सहायक)
- **Conversational Assistant**: Ask questions in Hindi or English regarding crop diseases, organic pest treatments (Neem oil, Jeevamrit), and fertilizer application rates.
- **Land Unit Converter**: Converts between regional land measurement units:
  - *Bigha (Standard / Pucca / Kaccha), Acre, Hectare, Guntha, Kanal, Marla, Biswa, Katha, Square Feet, and Square Meters*.
- **Fertilizer Calculator**: Computes recommended commercial bags of Urea, DAP, and MOP from target N-P-K nutrient ratios.

### 7. Bilingual & Offline-Ready Data Management
- **Instant Language Switching**: Toggle seamlessly between Hindi (हिंदी) and English across all tabs, forms, charts, and metrics.
- **Privacy-First Local Storage**: All farm records, financial entries, and reminder data remain stored safely in the user's browser local storage—no compulsory account creation required.
- **Backup & Restore**: Export all app state into an encrypted/portable JSON file and restore it onto any mobile device or tablet.

---

## 🛠 Architecture & Tech Stack

```
gramin-village-super-app/
├── server.ts                 # Express full-stack API server + Vite middleware
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component & global state coordination
│   ├── types.ts              # TypeScript interfaces, unions, and data types
│   ├── components/           # Modular application views and tabs
│   │   ├── OverviewDashboard.tsx      # Core dashboard & priority feeds
│   │   ├── WeatherForecastWidget.tsx  # 7-day Google Search grounded weather
│   │   ├── ExpensesTab.tsx            # Expense logs & filtering
│   │   ├── ExpenseCategoryPieChart.tsx# Recharts category pie chart
│   │   ├── PlantationTab.tsx          # Crop cycles, spraying & harvest logs
│   │   ├── GiftsTab.tsx               # Shagun & ceremonial gift ledger
│   │   ├── RemindersTab.tsx           # Agricultural & financial reminders
│   │   ├── ToolsTab.tsx               # Kisan AI advisor & land calculators
│   │   ├── VoiceInputButton.tsx       # Web Speech API speech-to-text button
│   │   └── modals/                    # Add/edit forms & backup/restore modal
│   └── utils/
│       ├── storage.ts        # LocalStorage persistence & CSV export
│       └── translations.ts   # Complete Hindi & English translation dictionary
```

- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Motion, Lucide React, Recharts.
- **Backend**: Express.js with Node.js, `tsx` for live execution, `esbuild` for production bundling.
- **AI & Grounding**: Google Gen AI SDK (`@google/genai`) with `gemini-3.8-flash` and Google Search Grounding (`tools: [{ googleSearch: {} }]`).

---

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A Google Gemini API Key (obtainable from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/gramin-village-super-app.git
   cd gramin-village-super-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

> **Note**: The app includes comprehensive agronomic fallbacks and in-memory caching. If the API key is omitted, core features, local ledger functions, and sample weather advisories will still function smoothly.

### Development Server

Start the full-stack development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### Production Build

To build the static frontend assets and bundle the server:
```bash
npm run build
```

To start the production server:
```bash
npm start
```

---

## 📡 API Endpoints

The Express server exposes backend endpoints that proxy AI and meteorological services securely:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/weather/forecast` | Fetches a 7-day agricultural weather forecast grounded by Google Search, complete with operation windows (spraying, irrigation, harvesting). |
| `POST` | `/api/ai/advisor` | Handles bilingual conversational farming and village advisory questions via Gemini. |
| `POST` | `/api/ai/crop-schedule` | Generates a crop lifecycle management timeline from sowing to harvesting. |
| `GET` | `/api/health` | Health check probe returning server status. |

---

## 🎨 Design & Accessibility Principles

- **High Contrast & Readability**: Clean neutral palettes paired with nature-inspired agricultural tones (emerald green, warm amber, deep blue).
- **Mobile-First & Touch Targets**: Generous tap targets (minimum 44px) and clear spacing suited for outdoor mobile phone usage under sunlight.
- **Bilingual By Design**: Every UI control, data card, modal, and advisory note is natively translated into Hindi and English.
- **Strict Data Security**: Sensitive financial records remain in browser local storage and are never uploaded to third-party databases without explicit user export.

---

## 🤝 Contributing

Contributions are welcome! If you would like to help improve Gramin:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/crop-disease-scanner`).
3. Commit your changes (`git commit -m 'Add crop disease scanner support'`).
4. Push to the branch (`git push origin feature/crop-disease-scanner`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
