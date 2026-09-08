package com.example.data.repository

import com.example.data.local.GraminDatabase
import com.example.data.model.BahiKhataItem
import com.example.data.model.DayForecast
import com.example.data.model.ExpenseItem
import com.example.data.model.FertilizerLog
import com.example.data.model.GiftItem
import com.example.data.model.HarvestRecord
import com.example.data.model.IrrigationLog
import com.example.data.model.Language
import com.example.data.model.MandiPrice
import com.example.data.model.PlantationCrop
import com.example.data.model.ReminderItem
import com.example.data.model.SprayLog
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first

data class FertilizerCalculationResult(
    val ureaBags: Double,
    val dapBags: Double,
    val potashBags: Double,
    val zincKg: Double,
    val schedule: List<String>
)

class GraminRepository(private val db: GraminDatabase) {
    private val expenseDao = db.expenseDao()
    private val cropDao = db.cropDao()
    private val reminderDao = db.reminderDao()
    private val giftDao = db.giftDao()
    private val bahiKhataDao = db.bahiKhataDao()

    val allExpenses: Flow<List<ExpenseItem>> = expenseDao.getAllExpenses()
    val allCrops: Flow<List<PlantationCrop>> = cropDao.getAllCrops()
    val allReminders: Flow<List<ReminderItem>> = reminderDao.getAllReminders()
    val allGifts: Flow<List<GiftItem>> = giftDao.getAllGifts()
    val allBahiKhata: Flow<List<BahiKhataItem>> = bahiKhataDao.getAllBahiKhata()

    suspend fun seedInitialDataIfEmpty() {
        val expenses = allExpenses.first()
        if (expenses.isEmpty()) {
            expenseDao.insertAll(initialExpenses)
            cropDao.insertAll(initialCrops)
            reminderDao.insertAll(initialReminders)
            giftDao.insertAll(initialGifts)
            bahiKhataDao.insertAll(initialBahiKhata)
        }
    }

    // Expense operations
    suspend fun insertExpense(item: ExpenseItem) = expenseDao.insertExpense(item)
    suspend fun deleteExpense(id: String) = expenseDao.deleteById(id)

    // Crop operations
    suspend fun insertCrop(crop: PlantationCrop) = cropDao.insertCrop(crop)
    suspend fun updateCrop(crop: PlantationCrop) = cropDao.updateCrop(crop)
    suspend fun deleteCrop(id: String) = cropDao.deleteById(id)

    suspend fun addFertilizerLog(cropId: String, log: FertilizerLog, alsoAddExpense: Boolean) {
        val crops = allCrops.first()
        val crop = crops.find { it.id == cropId } ?: return
        val updated = crop.copy(fertilizerLogs = listOf(log) + crop.fertilizerLogs)
        cropDao.updateCrop(updated)

        if (alsoAddExpense && log.cost > 0) {
            insertExpense(
                ExpenseItem(
                    title = "${log.fertilizerType} (${log.quantity} ${log.unit})",
                    category = "fertilizer",
                    amount = log.cost,
                    date = log.date,
                    isFarming = true,
                    paymentMode = "cash",
                    cropOrPlot = crop.plotName,
                    quantityUsed = "${log.quantity} ${log.unit}",
                    notes = "Auto-logged from Plantation: ${log.stage}"
                )
            )
        }
    }

    suspend fun addSprayLog(cropId: String, log: SprayLog, alsoAddExpense: Boolean) {
        val crops = allCrops.first()
        val crop = crops.find { it.id == cropId } ?: return
        val updated = crop.copy(sprayLogs = listOf(log) + crop.sprayLogs)
        cropDao.updateCrop(updated)

        if (alsoAddExpense && log.cost > 0) {
            insertExpense(
                ExpenseItem(
                    title = "${log.name} (Spray)",
                    category = "pesticide",
                    amount = log.cost,
                    date = log.date,
                    isFarming = true,
                    paymentMode = "cash",
                    cropOrPlot = crop.plotName,
                    notes = "Spray Purpose: ${log.purpose}"
                )
            )
        }
    }

    suspend fun addHarvestRecord(cropId: String, record: HarvestRecord) {
        val crops = allCrops.first()
        val crop = crops.find { it.id == cropId } ?: return
        val updated = crop.copy(
            status = "harvested",
            harvestRecords = listOf(record) + crop.harvestRecords
        )
        cropDao.updateCrop(updated)
    }

    // Reminder operations
    suspend fun insertReminder(item: ReminderItem) = reminderDao.insertReminder(item)
    suspend fun toggleReminder(item: ReminderItem) = reminderDao.updateReminder(item.copy(completed = !item.completed))
    suspend fun deleteReminder(id: String) = reminderDao.deleteById(id)

    // Gift operations
    suspend fun insertGift(item: GiftItem) = giftDao.insertGift(item)
    suspend fun toggleGiftSettled(item: GiftItem) = giftDao.updateGift(item.copy(counterGiftSettled = !item.counterGiftSettled))
    suspend fun deleteGift(id: String) = giftDao.deleteById(id)

    // Bahi Khata operations
    suspend fun insertBahiKhata(item: BahiKhataItem) = bahiKhataDao.insertBahiKhata(item)
    suspend fun toggleBahiSettled(item: BahiKhataItem) = bahiKhataDao.updateBahiKhata(item.copy(settled = !item.settled))
    suspend fun deleteBahiKhata(id: String) = bahiKhataDao.deleteById(id)

    // Fertilizer dosage calculator
    fun calculateFertilizer(crop: String, area: Double, unit: String, lang: Language): FertilizerCalculationResult {
        val factor = if (unit.equals("Bigha", ignoreCase = true)) area * 0.4 else area
        val isWheat = crop.contains("wheat", ignoreCase = true) || crop.contains("gehun", ignoreCase = true) || crop.contains("गेहूं")
        val isMustard = crop.contains("mustard", ignoreCase = true) || crop.contains("sarson", ignoreCase = true) || crop.contains("सरसों")
        val isPaddy = crop.contains("paddy", ignoreCase = true) || crop.contains("rice", ignoreCase = true) || crop.contains("धान")
        val isPotato = crop.contains("potato", ignoreCase = true) || crop.contains("aloo", ignoreCase = true) || crop.contains("आलू")

        return when {
            isWheat -> FertilizerCalculationResult(
                ureaBags = Math.round(factor * 2.5 * 10.0) / 10.0,
                dapBags = Math.round(factor * 1.0 * 10.0) / 10.0,
                potashBags = Math.round(factor * 0.5 * 10.0) / 10.0,
                zincKg = Math.round(factor * 10.0 * 10.0) / 10.0,
                schedule = if (lang == Language.HI) listOf(
                    "बुवाई के समय (Basal): 1 बोरी DAP + 0.5 बोरी पोटाश + 10kg जिंक सल्फेट प्रति एकड़",
                    "पहली सिंचाई (21 दिन - CRI जड़ फुटाव): 1 बोरी यूरिया का पहला टॉप ड्रेसिंग",
                    "दूसरी सिंचाई (40-45 दिन - कल्ले बनते समय): 1 बोरी यूरिया का दूसरा टॉप ड्रेसिंग"
                ) else listOf(
                    "At Sowing (Basal): 1 Bag DAP + 0.5 Bag MOP Potash + 10kg Zinc Sulphate per Acre",
                    "1st Irrigation (21 Days - CRI Rooting stage): 1 Bag Urea Top Dressing",
                    "2nd Irrigation (40-45 Days - Tillering stage): 1 Bag Urea Top Dressing"
                )
            )
            isMustard -> FertilizerCalculationResult(
                ureaBags = Math.round(factor * 1.5 * 10.0) / 10.0,
                dapBags = Math.round(factor * 0.8 * 10.0) / 10.0,
                potashBags = Math.round(factor * 0.4 * 10.0) / 10.0,
                zincKg = Math.round(factor * 5.0 * 10.0) / 10.0,
                schedule = if (lang == Language.HI) listOf(
                    "बुवाई के समय: पूरा DAP व पोटाश + 10kg बेंटोनाइट सल्फर प्रति एकड़",
                    "पहली सिंचाई (फूल आने से पूर्व 30 दिन): 1 बोरी यूरिया का छींटा"
                ) else listOf(
                    "At Sowing: Full DAP, Potash + 10kg Bentonite Sulphur per Acre",
                    "1st Irrigation (Before Flowering ~30 days): 1 Bag Urea broadcasting"
                )
            )
            isPaddy -> FertilizerCalculationResult(
                ureaBags = Math.round(factor * 2.6 * 10.0) / 10.0,
                dapBags = Math.round(factor * 1.0 * 10.0) / 10.0,
                potashBags = Math.round(factor * 0.8 * 10.0) / 10.0,
                zincKg = Math.round(factor * 10.0 * 10.0) / 10.0,
                schedule = if (lang == Language.HI) listOf(
                    "रोपाई के समय (Basal): 1 बोरी DAP + आधा बोरी पोटाश + 10kg जिंक (21%)",
                    "रोपाई के 20-25 दिन बाद: 1 बोरी यूरिया का पहला टॉप ड्रेसिंग",
                    "रोपाई के 45 दिन बाद (कल्ले निकलते समय): 1 बोरी यूरिया का दूसरा टॉप ड्रेसिंग"
                ) else listOf(
                    "At Transplanting (Basal): 1 Bag DAP + 0.5 Bag MOP Potash + 10kg Zinc Sulphate",
                    "20-25 Days after Transplanting: 1 Bag Urea Top Dressing",
                    "45 Days after Transplanting (Tillering stage): 1 Bag Urea Top Dressing"
                )
            )
            isPotato -> FertilizerCalculationResult(
                ureaBags = Math.round(factor * 3.5 * 10.0) / 10.0,
                dapBags = Math.round(factor * 2.0 * 10.0) / 10.0,
                potashBags = Math.round(factor * 1.5 * 10.0) / 10.0,
                zincKg = Math.round(factor * 8.0 * 10.0) / 10.0,
                schedule = if (lang == Language.HI) listOf(
                    "बुवाई के समय: पूरा DAP + 1 बोरी पोटाश + 1 बोरी यूरिया मिट्टी में मिलाएँ",
                    "मिट्टी चढ़ाते समय (Earthing Up 30-35 दिन): शेष यूरिया व आधा बोरी पोटाश डालें"
                ) else listOf(
                    "At Planting: Full DAP + 1 Bag Potash + 1 Bag Urea in furrows",
                    "At Earthing Up (30-35 days): Remaining Urea + 0.5 Bag Potash"
                )
            )
            else -> FertilizerCalculationResult(
                ureaBags = Math.round(factor * 2.0 * 10.0) / 10.0,
                dapBags = Math.round(factor * 1.0 * 10.0) / 10.0,
                potashBags = Math.round(factor * 0.5 * 10.0) / 10.0,
                zincKg = Math.round(factor * 5.0 * 10.0) / 10.0,
                schedule = if (lang == Language.HI) listOf(
                    "बुवाई के समय: 1 बोरी DAP + आधा बोरी पोटाश",
                    "सिंचाई के समय: यूरिया को दो भागों में बाँटकर सिंचाई उपरांत दें"
                ) else listOf(
                    "At Sowing: 1 Bag DAP + 0.5 Bag Potash",
                    "During Active Growth: Split remaining Urea into two top dressings"
                )
            )
        }
    }

    // Live Mandi Prices
    fun getMandiPrices(): List<MandiPrice> {
        return listOf(
            MandiPrice("m1", "Wheat (Sharbati/Lokwan)", "गेहूं (शरबती)", "Indore Mandi, MP", 2680.0, 2275.0, "up", "Today 10:30 AM"),
            MandiPrice("m2", "Mustard (Sarson)", "सरसों", "Alwar Mandi, RJ", 5450.0, 5650.0, "stable", "Today 11:15 AM"),
            MandiPrice("m3", "Paddy (1121 Basmati)", "धान (बासमती)", "Karnal Mandi, HR", 4320.0, 2300.0, "up", "Today 09:45 AM"),
            MandiPrice("m4", "Potato (Desi/Kufri)", "आलू (कुफरी)", "Agra Mandi, UP", 1480.0, 1200.0, "down", "Today 11:00 AM"),
            MandiPrice("m5", "Gram / Chana", "चना (देसी)", "Latur Mandi, MH", 5850.0, 5440.0, "up", "Today 10:00 AM"),
            MandiPrice("m6", "Soybean (Yellow)", "सोयाबीन", "Dewas Mandi, MP", 4650.0, 4892.0, "stable", "Today 08:30 AM")
        )
    }

    // 5-Day Weather Forecast for Farming
    fun getWeatherForecast(lang: Language): List<DayForecast> {
        return if (lang == Language.HI) {
            listOf(
                DayForecast("आज (मंगल)", "14 Sep", "साफ धूप (Sunny)", 33, 22, 10, "मौसम पूरी तरह अनुकूल है। कीटनाशक व टॉनिक का छिड़काव आसानी से कर सकते हैं।", "अनुकूल (Favorable)", "सामान्य आवश्यकता"),
                DayForecast("कल (बुध)", "15 Sep", "हल्के बादल (Partly Cloudy)", 32, 23, 20, "हल्की हवा रहेगी। सुबह के समय छिड़काव या खरपतवार नियंत्रण कार्य निपटाएँ।", "सुबह उत्तम", "सिंचाई जारी रखें"),
                DayForecast("गुरुवार", "16 Sep", "बूंदाबांदी की संभावना", 29, 21, 65, "बारिश के आसार हैं। आज किसी भी प्रकार का रासायनिक स्प्रे या यूरिया का छींटा न दें।", "रोकें (Pause)", "सिंचाई स्थगित करें"),
                DayForecast("शुक्रवार", "17 Sep", "हल्की वर्षा (Light Rain)", 28, 20, 75, "खेतों में जलभराव न होने दें। सब्जियों की क्यारियों में जल निकासी व्यवस्था देखें।", "प्रतिकूल (Risky)", "सिंचाई बंद रखें"),
                DayForecast("शनिवार", "18 Sep", "धूप व नमी", 31, 22, 15, "वर्षा पश्चात मिट्टी में पर्याप्त नमी रहेगी। पछेती बुवाई या निकाई-गुड़ाई हेतु उत्तम।", "अनुकूल", "नमी पर्याप्त है")
            )
        } else {
            listOf(
                DayForecast("Today (Tue)", "14 Sep", "Clear Sunny", 33, 22, 10, "Weather is calm and clear. Ideal day for foliar spray and top dressing.", "Favorable", "Normal Routine"),
                DayForecast("Tomorrow (Wed)", "15 Sep", "Partly Cloudy", 32, 23, 20, "Mild morning breeze. Good for field weeding and morning pesticide spray.", "Good in Morning", "Proceed with Irrigation"),
                DayForecast("Thursday", "16 Sep", "Scattered Showers", 29, 21, 65, "Rain forecast across the tehsil. Hold off chemical spraying to prevent runoff.", "Pause Spraying", "Do Not Irrigate"),
                DayForecast("Friday", "17 Sep", "Light Rains", 28, 20, 75, "Ensure drainage trenches are clear in vegetable ridges and low-lying plots.", "Unfavorable", "Irrigation Paused"),
                DayForecast("Saturday", "18 Sep", "Warm & Humid", 31, 22, 15, "Post-rain soil moisture is optimal for intercultural hoeing and root aeration.", "Favorable", "Soil Moisture Adequate")
            )
        }
    }

    // AI Kisan Assistant
    fun answerKisanQuestion(question: String, lang: Language): String {
        val q = question.lowercase()
        return if (lang == Language.HI) {
            when {
                q.contains("यूरिया") || q.contains("urea") || q.contains("खाद") ->
                    "किसान भाई, गेहूं व धान में यूरिया हमेशा 2 या 3 भागों (Splits) में दें। पहली सिंचाई के बाद 1 बोरी यूरिया प्रति एकड़ दें। यूरिया के साथ 5kg जिंक सल्फेट (33%) मिलाने से पैदावार 15-20% बढ़ती है। कभी भी तेज धूप या भारी बारिश से पहले यूरिया न बिखेरें।"
                q.contains("पीला") || q.contains("yellow") || q.contains("रोग") || q.contains("कीट") ->
                    "यदि पत्तियों पर पीलापन या पाउडर जैसा दिख रहा है, तो यह पीला रतुआ (Yellow Rust) या फफूंद हो सकता है। रोकथाम हेतु प्रोपिकोनाजोल 25% EC (टिल्ट) 200ml को 200 लीटर पानी में मिलाकर प्रति एकड़ छिड़कें। कीट होने पर इमिडाक्लोप्रिड 17.8% SL 50ml/एकड़ डालें।"
                q.contains("सिंचाई") || q.contains("irrigation") || q.contains("पानी") ->
                    "गेहूं में पहली सिंचाई बुवाई के 20-25 दिन बाद (CRI जड़ फुटाव अवस्था) पर सबसे महत्वपूर्ण है। इस समय पानी की कमी होने पर कल्ले कम फूटते हैं। हमेशा हल्की सिंचाई करें ताकि पौधे जमीन पर न गिरें।"
                q.contains("kcc") || q.contains("लोन") || q.contains("कर्ज") ->
                    "KCC (किसान क्रेडिट कार्ड) पर सरकार 3% की ब्याज छूट (Interest Subvention) देती है। समय पर ऋण चुकता करने पर शुद्ध ब्याज केवल 4% वार्षिक लगता है। वर्ष में एक बार ब्याज जमा करके खाता रीन्यू अवश्य करवाएँ।"
                else ->
                    "नमस्कार किसान भाई! आपकी समस्या के समाधान के लिए: सही समय पर संतुलित खाद (NPK 4:2:1 अनुपात), प्रमाणित बीजों का चयन, और मौसम देखकर ही सिंचाई व कीटनाशक छिड़काव करें। नजदीकी कृषि विज्ञान केंद्र (KVK) या टोल-फ्री किसान कॉल सेंटर 1800-180-1551 पर भी निःशुल्क परामर्श ले सकते हैं।"
            }
        } else {
            when {
                q.contains("urea") || q.contains("fertilizer") || q.contains("dose") ->
                    "Farmer friend, split Urea into 2-3 top dressings rather than applying all at once. For Wheat, apply 1 Bag Urea per Acre after the 1st irrigation (CRI stage) mixed with 5kg Zinc Sulphate (33%) to boost tillering by 15-20%."
                q.contains("yellow") || q.contains("disease") || q.contains("pest") || q.contains("rust") ->
                    "If yellow powdery stripes appear on leaves, it indicates Yellow Rust or fungal blight. Spray Propiconazole 25% EC @ 200ml in 200 Litres water per acre. For aphid/sucking pests, apply Imidacloprid 17.8% SL @ 50ml/acre."
                q.contains("irrigation") || q.contains("water") ->
                    "The Crown Root Initiation (CRI) stage at 20-25 days after sowing is the most critical irrigation for wheat. Moisture stress at this stage severely hampers tillering. Ensure uniform, light irrigation without water stagnation."
                q.contains("kcc") || q.contains("loan") || q.contains("subsidy") ->
                    "Under the PM Kisan Credit Card (KCC) scheme, punctual repayment qualifies for a 3% prompt repayment incentive, reducing your net interest to just 4% per annum. Renew your account annually before the due date."
                else ->
                    "Welcome Kisan! For best farm yields: follow balanced soil-tested fertilization (NPK + Zinc + Sulphur), certified seed varieties, and check weather before chemical applications. You can also dial the National Kisan Helpline at 1800-180-1551 (Toll-Free) for live scientist assistance."
            }
        }
    }

    companion object {
        val initialExpenses = listOf(
            ExpenseItem(
                id = "exp-1",
                title = "Urea Fertilizer (2 Bags) for Wheat Field",
                category = "fertilizer",
                amount = 540.0,
                date = "2026-08-14",
                isFarming = true,
                paymentMode = "cash",
                cropOrPlot = "North Field - Wheat",
                quantityUsed = "2 Bags (90 kg)",
                notes = "Purchased from IFFCO Kisan Seva Kendra with subsidy"
            ),
            ExpenseItem(
                id = "exp-2",
                title = "Weekly Village Grocery & Ration",
                category = "groceries",
                amount = 1850.0,
                date = "2026-08-16",
                isFarming = false,
                paymentMode = "upi",
                quantityUsed = "10kg Aata, 5L Mustard Oil, 2kg Dal",
                notes = "Purchased from Sharma Kirana Store"
            ),
            ExpenseItem(
                id = "exp-3",
                title = "DAP Fertilizer (1 Bag) & Zinc Sulphate",
                category = "fertilizer",
                amount = 1750.0,
                date = "2026-08-08",
                isFarming = true,
                paymentMode = "cash",
                cropOrPlot = "East Canal Field - Mustard",
                quantityUsed = "1 Bag DAP (50kg) + 5kg Zinc",
                notes = "Basal dose applied during sowing bed preparation"
            ),
            ExpenseItem(
                id = "exp-4",
                title = "Diesel for Tractor Ploughing & Rotavator",
                category = "diesel_tractor",
                amount = 2100.0,
                date = "2026-08-10",
                isFarming = true,
                paymentMode = "upi",
                cropOrPlot = "North Field - Wheat",
                quantityUsed = "22 Liters",
                notes = "Deep tilling before sowing"
            ),
            ExpenseItem(
                id = "exp-5",
                title = "Certified Wheat Seeds (HD-2967)",
                category = "seeds",
                amount = 2400.0,
                date = "2026-08-05",
                isFarming = true,
                paymentMode = "cash",
                cropOrPlot = "North Field - Wheat",
                quantityUsed = "60 kg Seeds",
                notes = "From District Agriculture Research Centre"
            ),
            ExpenseItem(
                id = "exp-6",
                title = "Farm Labor Wages for Weeding (Nirayi)",
                category = "labor",
                amount = 1600.0,
                date = "2026-08-15",
                isFarming = true,
                paymentMode = "cash",
                cropOrPlot = "Vegetable Patch",
                quantityUsed = "4 Laborers x ₹400",
                notes = "Hand weeding for potato ridges"
            ),
            ExpenseItem(
                id = "exp-7",
                title = "Monthly Tubewell Electricity Bill",
                category = "electricity_bills",
                amount = 720.0,
                date = "2026-08-12",
                isFarming = true,
                paymentMode = "upi",
                cropOrPlot = "All Fields",
                notes = "Paid online via State Power Portal"
            ),
            ExpenseItem(
                id = "exp-8",
                title = "Children School Books & Stationeries",
                category = "education",
                amount = 950.0,
                date = "2026-08-07",
                isFarming = false,
                paymentMode = "cash",
                quantityUsed = "Books, Notebooks, Geometry",
                notes = "Stationery store in town"
            )
        )

        val initialCrops = listOf(
            PlantationCrop(
                id = "crop-1",
                plotName = "North Field (Tubewell side)",
                areaValue = 3.5,
                areaUnit = "Acre",
                soilType = "Alluvial Loam (दोमट मिट्टी)",
                cropName = "Wheat (गेहूं)",
                variety = "HD-2967 (Sharbati)",
                plantingDate = "2026-07-20",
                expectedHarvestDate = "2026-11-25",
                status = "growing",
                fertilizerLogs = listOf(
                    FertilizerLog(
                        id = "f-1",
                        date = "2026-07-20",
                        fertilizerType = "DAP (Di-Ammonium Phosphate)",
                        quantity = 3.5,
                        unit = "bags",
                        cost = 4725.0,
                        applicationMethod = "Basal Application",
                        stage = "Basal Sowing",
                        notes = "Mixed with soil before seed drilling"
                    ),
                    FertilizerLog(
                        id = "f-2",
                        date = "2026-08-14",
                        fertilizerType = "Neem Coated Urea",
                        quantity = 3.5,
                        unit = "bags",
                        cost = 945.0,
                        applicationMethod = "Broadcasting",
                        stage = "First Top Dressing (21 Days CRI)",
                        notes = "Applied following first tube well irrigation"
                    )
                ),
                sprayLogs = listOf(
                    SprayLog(
                        id = "s-1",
                        date = "2026-08-18",
                        name = "Sulfosulfuron 75% WG",
                        purpose = "Broadleaf & Phalaris minor weed control (Mandusi)",
                        cost = 850.0
                    )
                ),
                irrigationLogs = listOf(
                    IrrigationLog(
                        id = "i-1",
                        date = "2026-08-12",
                        source = "Tubewell / Borewell",
                        hours = 6.0,
                        electricityOrDieselCost = 350.0
                    )
                ),
                notes = "High-yield certified seed bed. Regular soil moisture monitored."
            ),
            PlantationCrop(
                id = "crop-2",
                plotName = "East Canal Road Field",
                areaValue = 2.0,
                areaUnit = "Acre",
                soilType = "Sandy Loam (बलुई दोमट)",
                cropName = "Mustard (सरसों)",
                variety = "Pusa Bold (RH-749)",
                plantingDate = "2026-08-01",
                expectedHarvestDate = "2026-12-10",
                status = "growing",
                fertilizerLogs = listOf(
                    FertilizerLog(
                        id = "f-3",
                        date = "2026-08-01",
                        fertilizerType = "NPK 12:32:16 + Sulphur 90%",
                        quantity = 2.0,
                        unit = "bags",
                        cost = 3100.0,
                        applicationMethod = "Basal Application",
                        stage = "Basal Sowing",
                        notes = "Bentonite sulphur added to increase oil content"
                    )
                ),
                sprayLogs = emptyList(),
                irrigationLogs = listOf(
                    IrrigationLog(
                        id = "i-2",
                        date = "2026-08-02",
                        source = "Canal",
                        hours = 4.0,
                        electricityOrDieselCost = 120.0
                    )
                ),
                notes = "Canal water available on weekly roaster."
            ),
            PlantationCrop(
                id = "crop-3",
                plotName = "Homestead Garden Patch",
                areaValue = 1.0,
                areaUnit = "Acre",
                soilType = "Rich Clay Loam",
                cropName = "Potato (आलू)",
                variety = "Kufri Jyoti",
                plantingDate = "2026-06-10",
                expectedHarvestDate = "2026-09-15",
                status = "harvest_ready",
                fertilizerLogs = listOf(
                    FertilizerLog(
                        id = "f-4",
                        date = "2026-06-10",
                        fertilizerType = "Vermicompost + DAP",
                        quantity = 10.0,
                        unit = "quintal",
                        cost = 3800.0,
                        applicationMethod = "Basal Application",
                        stage = "Tuber Sowing"
                    )
                ),
                harvestRecords = listOf(
                    HarvestRecord(
                        id = "h-1",
                        date = "2026-09-02",
                        yieldAmount = 85.0,
                        unit = "Quintal",
                        sellingRatePerUnit = 1450.0,
                        totalRevenue = 123250.0,
                        buyerOrMandi = "Agra Potato Mandi - Vyapari Rameshwar",
                        notes = "Graded A-quality table potatoes"
                    )
                ),
                notes = "Profitable cash crop harvest completed successfully."
            )
        )

        val initialReminders = listOf(
            ReminderItem(
                id = "rem-1",
                title = "Wheat Field 1st Irrigation (CRI Stage 21 Days)",
                category = "irrigation_due",
                dueDate = "2026-08-20",
                dueTime = "06:30 AM",
                priority = "high",
                completed = false,
                notes = "Crown root initiation stage - crucial for tillers",
                relatedPlotOrCrop = "North Field - Wheat"
            ),
            ReminderItem(
                id = "rem-2",
                title = "PM-Kisan 19th Installment e-KYC Verification",
                category = "general",
                dueDate = "2026-08-22",
                dueTime = "11:00 AM",
                priority = "high",
                completed = false,
                notes = "Visit CSC center with Aadhaar & biometric linking"
            ),
            ReminderItem(
                id = "rem-3",
                title = "KCC Loan Half-Yearly Interest Subvention Due",
                category = "kcc_loan_emi",
                dueDate = "2026-08-31",
                dueTime = "02:00 PM",
                priority = "medium",
                completed = false,
                notes = "Deposit ₹12,400 to claim 3% interest rebate benefit"
            ),
            ReminderItem(
                id = "rem-4",
                title = "Book Subsidized DAP Bags at Cooperative Society",
                category = "fertilizer_due",
                dueDate = "2026-08-25",
                dueTime = "10:00 AM",
                priority = "medium",
                completed = true,
                notes = "Carry Kisan Bahi and Aadhaar card"
            ),
            ReminderItem(
                id = "rem-5",
                title = "Return Wedding Shagun to Master Verma Ji",
                category = "gift_return",
                dueDate = "2026-09-05",
                priority = "low",
                completed = false,
                notes = "His daughter's wedding at Rampur village banquet"
            )
        )

        val initialGifts = listOf(
            GiftItem(
                id = "gift-1",
                type = "received",
                personName = "Sarpanch Mahendra Singh",
                villageOrRelation = "Rampur Khurd (Village Elder)",
                occasion = "Son Wedding / Barat",
                date = "2026-05-18",
                giftCategory = "cash",
                amountOrValue = 5100.0,
                itemDescription = "₹5,100 Cash + 1 Silver Coin (10g)",
                counterGiftSettled = true,
                counterGiftDetails = "Returned ₹5,100 at their nephew's wedding on 12/07/2026"
            ),
            GiftItem(
                id = "gift-2",
                type = "received",
                personName = "Chaudhary Rameshwar Dayal",
                villageOrRelation = "Chandoi (Mama Ji)",
                occasion = "Daughter Wedding / Kanyadan",
                date = "2026-04-12",
                giftCategory = "gold_silver",
                amountOrValue = 21000.0,
                itemDescription = "Gold Nath (4g) & ₹5,100 Envelop Shagun",
                counterGiftSettled = false,
                counterGiftDetails = "Need to return at cousin wedding in November"
            ),
            GiftItem(
                id = "gift-3",
                type = "given",
                personName = "Pandit Radhey Shyam",
                villageOrRelation = "Village Temple Priest",
                occasion = "Housewarming / Griha Pravesh",
                date = "2026-06-25",
                giftCategory = "utensils",
                amountOrValue = 2500.0,
                itemDescription = "Pure Brass Pooja Thali Set + ₹1,100 Dakshina",
                counterGiftSettled = true
            ),
            GiftItem(
                id = "gift-4",
                type = "given",
                personName = "Suresh Yadav (Fufa Ji)",
                villageOrRelation = "Dholpur",
                occasion = "Mundan / Baby Shower",
                date = "2026-07-04",
                giftCategory = "cash",
                amountOrValue = 2100.0,
                itemDescription = "₹2,100 Cash Envelope + Baby Clothes Set",
                counterGiftSettled = false
            )
        )

        val initialBahiKhata = listOf(
            BahiKhataItem(
                id = "bahi-1",
                personName = "Kallu Mistri (Tractor Repair)",
                phone = "9876543210",
                type = "you_took",
                amount = 3500.0,
                date = "2026-08-10",
                dueDate = "2026-09-10",
                settled = false,
                purpose = "Hydraulic pump & rotavator blades overhaul",
                notes = "To pay after potato mandi payment"
            ),
            BahiKhataItem(
                id = "bahi-2",
                personName = "Mohan Pal (Neighbor Farmer)",
                phone = "9823456789",
                type = "you_gave",
                amount = 5000.0,
                date = "2026-08-01",
                dueDate = "2026-08-30",
                settled = false,
                purpose = "Emergency loan for diesel & sowing labor",
                notes = "Promised to return after mustard crop sale"
            ),
            BahiKhataItem(
                id = "bahi-3",
                personName = "Gupta Kirana Store",
                phone = "9412345678",
                type = "you_took",
                amount = 1850.0,
                date = "2026-08-15",
                dueDate = "2026-08-31",
                settled = true,
                purpose = "Monthly grocery & tea ration",
                notes = "Cleared via PhonePe UPI"
            ),
            BahiKhataItem(
                id = "bahi-4",
                personName = "Deshraj Dairy (Milk Center)",
                phone = "9712398765",
                type = "you_gave",
                amount = 4200.0,
                date = "2026-08-05",
                settled = true,
                purpose = "Advance buffalo fodder supply (bhusa)",
                notes = "Settled against 15-day milk payment"
            )
        )
    }
}
