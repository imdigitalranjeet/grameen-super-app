package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

enum class Language {
    EN, HI
}

@Entity(tableName = "expenses")
@Serializable
data class ExpenseItem(
    @PrimaryKey val id: String = "exp-${System.currentTimeMillis()}",
    val title: String,
    val category: String, // fertilizer, seeds, pesticide, diesel_tractor, labor, irrigation, groceries, medical, education, electricity_bills, livestock_fodder, other
    val amount: Double,
    val date: String,
    val isFarming: Boolean,
    val paymentMode: String = "cash", // cash, upi, credit, bank_transfer
    val cropOrPlot: String? = null,
    val quantityUsed: String? = null,
    val notes: String? = null
)

@Serializable
data class FertilizerLog(
    val id: String = "fert-${System.currentTimeMillis()}",
    val date: String,
    val fertilizerType: String,
    val quantity: Double,
    val unit: String = "bags",
    val cost: Double,
    val applicationMethod: String = "Broadcasting",
    val stage: String = "Basal Sowing",
    val notes: String? = null
)

@Serializable
data class SprayLog(
    val id: String = "spray-${System.currentTimeMillis()}",
    val date: String,
    val name: String,
    val purpose: String,
    val cost: Double
)

@Serializable
data class IrrigationLog(
    val id: String = "irri-${System.currentTimeMillis()}",
    val date: String,
    val source: String = "Tubewell / Borewell",
    val hours: Double,
    val electricityOrDieselCost: Double
)

@Serializable
data class HarvestRecord(
    val id: String = "harv-${System.currentTimeMillis()}",
    val date: String,
    val yieldAmount: Double,
    val unit: String = "Quintal",
    val sellingRatePerUnit: Double,
    val totalRevenue: Double,
    val buyerOrMandi: String,
    val notes: String? = null
)

@Entity(tableName = "crops")
@Serializable
data class PlantationCrop(
    @PrimaryKey val id: String = "crop-${System.currentTimeMillis()}",
    val plotName: String,
    val areaValue: Double,
    val areaUnit: String = "Acre",
    val soilType: String,
    val cropName: String,
    val variety: String? = null,
    val plantingDate: String,
    val expectedHarvestDate: String,
    val status: String = "sown", // sown, growing, flowering, harvest_ready, harvested
    val fertilizerLogs: List<FertilizerLog> = emptyList(),
    val sprayLogs: List<SprayLog> = emptyList(),
    val irrigationLogs: List<IrrigationLog> = emptyList(),
    val harvestRecords: List<HarvestRecord> = emptyList(),
    val notes: String? = null
)

@Entity(tableName = "reminders")
@Serializable
data class ReminderItem(
    @PrimaryKey val id: String = "rem-${System.currentTimeMillis()}",
    val title: String,
    val category: String, // fertilizer_due, spray_due, irrigation_due, kcc_loan_emi, electricity_bill, seeds_booking, gram_sabha, gift_return, mandi_sale, general
    val dueDate: String,
    val dueTime: String? = null,
    val priority: String = "medium", // high, medium, low
    val completed: Boolean = false,
    val notes: String? = null,
    val relatedPlotOrCrop: String? = null
)

@Entity(tableName = "gifts")
@Serializable
data class GiftItem(
    @PrimaryKey val id: String = "gift-${System.currentTimeMillis()}",
    val type: String, // given, received
    val personName: String,
    val villageOrRelation: String,
    val occasion: String,
    val date: String,
    val giftCategory: String = "cash", // cash, gold_silver, utensils, clothes, livestock, other
    val amountOrValue: Double,
    val itemDescription: String? = null,
    val counterGiftSettled: Boolean = false,
    val counterGiftDetails: String? = null,
    val notes: String? = null
)

@Entity(tableName = "bahi_khata")
@Serializable
data class BahiKhataItem(
    @PrimaryKey val id: String = "bahi-${System.currentTimeMillis()}",
    val personName: String,
    val phone: String? = null,
    val type: String, // you_gave, you_took
    val amount: Double,
    val date: String,
    val dueDate: String? = null,
    val settled: Boolean = false,
    val purpose: String,
    val notes: String? = null
)

@Serializable
data class MandiPrice(
    val id: String,
    val crop: String,
    val cropHindi: String,
    val marketName: String,
    val modalPrice: Double,
    val mspRate: Double,
    val trend: String = "stable", // up, down, stable
    val lastUpdated: String
)

@Serializable
data class DayForecast(
    val day: String,
    val date: String,
    val condition: String,
    val tempMax: Int,
    val tempMin: Int,
    val rainProb: Int,
    val farmAdvice: String,
    val sprayingAdvice: String,
    val irrigationAdvice: String
)
