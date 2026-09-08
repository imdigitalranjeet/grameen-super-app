# 🌾 Gramin: Village Super App (ग्रामीण सुपर ऐप) - Android

> An all-in-one native Android application designed specifically for Indian rural households and farming communities. Built with modern Kotlin, Jetpack Compose, Material Design 3, and Room local database persistence. Manage agricultural & household expenses, monitor crop lifecycles & fertilizer logs, maintain the traditional Shagun/Bahi-Khata ledger, track critical village reminders, and access live agricultural tools.

[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white)](https://www.android.com/)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.1.0-7F52FF?logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![Jetpack Compose](https://img.shields.io/badge/Jetpack_Compose-BOM_2025.02.00-4285F4?logo=jetpackcompose&logoColor=white)](https://developer.android.com/jetpack/compose)
[![Material 3](https://img.shields.io/badge/Material_Design-3-1B73E8)](https://m3.material.io/)
[![Room](https://img.shields.io/badge/Room_Database-2.6.1-F4B400)](https://developer.android.com/training/data-storage/room)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [1. Overview Dashboard](#1-overview-dashboard)
  - [2. Expenses Tracker (हिसाब-किताब)](#2-expenses-tracker-हिसाब-किताब)
  - [3. Crop Lifecycle & Plantation Management (फसल चक्र)](#3-crop-lifecycle--plantation-management-फसल-चक्र)
  - [4. Smart Village Reminders (याद दिलाना)](#4-smart-village-reminders-याद-दिलाना)
  - [5. Shagun & Neota Registry (शगुन बही)](#5-shagun--neota-registry-शगुन-बही)
  - [6. Village Bahi-Khata (उधार-जमा लेजर)](#6-village-bahi-khata-उधार-जमा-लेजर)
  - [7. Agronomy Tools & Live Mandi Rates](#7-agronomy-tools--live-mandi-rates)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Building the Project](#-building-the-project)

---

## 🌟 Overview

Rural families and farmers often juggle diverse financial and operational streams—from agricultural inputs (fertilizers, diesel, seeds, labor wages) to household grocery bills, crop harvest schedules, government loan deadlines, and cultural occasion gifts (shagun/nyota). 

**Gramin: Village Super App** brings these essential records into a unified, native Android application crafted with Jetpack Compose. With local offline-first Room database storage, bilingual (Hindi/English) interface, and scientific agricultural calculators, it serves as a trusted companion for every rural household.

---

## 🚀 Key Features

### 1. Overview Dashboard
- Quick metric summary: Total spend, active plot acreage, due reminders count, and pending ledger balance.
- Agricultural weather advisory card with spraying and irrigation suitability indicators.
- One-tap quick actions to add expenses, plantation crops, reminders, or bahi-khata ledger entries.

### 2. Expenses Tracker (हिसाब-किताब)
- Filter by All Expenses, 🌾 Farming (fertilizer, seeds, diesel, labor, irrigation), and 🏠 Household (groceries, education, medical, bills).
- Category badges with icons, payment method tracking (Cash, UPI), crop plot links, and item descriptions.
- Instant total summary breakdown and item deletion.

### 3. Crop Lifecycle & Plantation Management (फसल चक्र)
- Plot & crop records with acreage (Acre / Bigha), soil type, sowing date, and growth stage.
- Fertilizer logs with basal vs top-dressing stage tracking.
- Spray logs for fungicides, weedicides, and pest management.
- Harvest records tracking yield in quintals, market sale price, buyer details, and net profit/loss calculation.

### 4. Smart Village Reminders (याद दिलाना)
- Agricultural reminders (CRI 1st irrigation, DAP cooperative booking).
- Financial deadlines (KCC loan interest subvention, electricity power roasters, PM-Kisan e-KYC).
- Priority badges (🔴 High, 🟡 Medium, 🟢 Low) and completed checkoff toggles.

### 5. Shagun & Neota Registry (शगुन बही)
- Traditional reciprocal gifting ledger tracking both **Given (दिया)** and **Received (मिला)** shagun.
- Track recipient/giver name, village/relation, occasion (wedding, mundan, griha pravesh), and counter-gift return settlement status.

### 6. Village Bahi-Khata (उधार-जमा लेजर)
- Daily village credit/debit register tracking **You Gave (आपने दिया)** vs **You Took (आपने लिया)**.
- Running balance indicator (Total Receivable vs Payable).
- Settle account toggle and phone number linkage.

### 7. Agronomy Tools & Live Mandi Rates
- **Fertilizer Dosage Calculator**: Computes scientific Urea, DAP, Potash, and Zinc requirements by crop and acreage with application schedule.
- **Live Mandi Rates**: APMC market prices with Government MSP comparison and price trend indicators.
- **Kisan AI Advisor**: Interactive conversational farming assistance for pest management, irrigation timing, and fertilizer schedules.
- **Agricultural Helplines**: One-tap access to Kisan Call Center (1800-180-1551), PM-Kisan, and PMFBY insurance assistance.

---

## 🛠 Architecture & Tech Stack

```
gramin-android/
├── app/
│   ├── build.gradle.kts       # App-level Gradle build configuration
│   ├── proguard-rules.pro     # ProGuard rules
│   └── src/main/
│       ├── AndroidManifest.xml # Permissions & activity declarations
│       ├── java/com/example/
│       │   ├── MainActivity.kt # Entry point activity with Edge-to-Edge
│       │   ├── data/
│       │   │   ├── model/      # Data entities (Expense, Crop, Reminder, Gift, Bahi)
│       │   │   ├── local/      # Room database, DAOs, and TypeConverters
│       │   │   └── repository/ # Seed data, CRUD repository, Fertilizer & AI logic
│       │   └── ui/
│       │       ├── GraminApp.kt       # NavigationBar & TopAppBar shell
│       │       ├── GraminViewModel.kt # State management & UI flows
│       │       ├── screens/           # Modular Compose screen implementations
│       │       └── theme/             # Material 3 typography, colors, and shapes
│       └── res/
│           ├── values/        # strings.xml, colors.xml, themes.xml
│           ├── drawable/      # Adaptive launcher foreground, background & art
│           ├── mipmap-anydpi-v26/ # Adaptive launcher icons
│           └── xml/           # Backup & data extraction rules
├── gradle/
│   └── libs.versions.toml     # Gradle Version Catalog
├── build.gradle.kts           # Root-level Gradle build
└── settings.gradle.kts        # Project settings
```

- **UI Toolkit**: Jetpack Compose with Material Design 3 (M3)
- **Language**: Kotlin 2.1.0
- **Database**: Android Room 2.6.1 with SQLite & Kotlinx Serialization
- **Architecture**: MVVM (Model-View-ViewModel) with Kotlin Coroutines and StateFlow
- **Minimum SDK**: Android 8.0 (API level 26)
- **Target SDK**: Android 15 (API level 35)

---

## 💻 Building the Project

Open the project in Android Studio or build via Gradle:
```bash
./gradlew assembleDebug
```
The debug APK will be generated at `app/build/outputs/apk/debug/app-debug.apk`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
