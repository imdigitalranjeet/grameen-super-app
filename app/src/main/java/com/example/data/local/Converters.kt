package com.example.data.local

import androidx.room.TypeConverter
import com.example.data.model.FertilizerLog
import com.example.data.model.HarvestRecord
import com.example.data.model.IrrigationLog
import com.example.data.model.SprayLog
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class Converters {
    private val json = Json { ignoreUnknownKeys = true }

    @TypeConverter
    fun fromFertilizerLogList(value: List<FertilizerLog>?): String {
        return json.encodeToString(value ?: emptyList())
    }

    @TypeConverter
    fun toFertilizerLogList(value: String?): List<FertilizerLog> {
        if (value.isNullOrBlank()) return emptyList()
        return try {
            json.decodeFromString(value)
        } catch (e: Exception) {
            emptyList()
        }
    }

    @TypeConverter
    fun fromSprayLogList(value: List<SprayLog>?): String {
        return json.encodeToString(value ?: emptyList())
    }

    @TypeConverter
    fun toSprayLogList(value: String?): List<SprayLog> {
        if (value.isNullOrBlank()) return emptyList()
        return try {
            json.decodeFromString(value)
        } catch (e: Exception) {
            emptyList()
        }
    }

    @TypeConverter
    fun fromIrrigationLogList(value: List<IrrigationLog>?): String {
        return json.encodeToString(value ?: emptyList())
    }

    @TypeConverter
    fun toIrrigationLogList(value: String?): List<IrrigationLog> {
        if (value.isNullOrBlank()) return emptyList()
        return try {
            json.decodeFromString(value)
        } catch (e: Exception) {
            emptyList()
        }
    }

    @TypeConverter
    fun fromHarvestRecordList(value: List<HarvestRecord>?): String {
        return json.encodeToString(value ?: emptyList())
    }

    @TypeConverter
    fun toHarvestRecordList(value: String?): List<HarvestRecord> {
        if (value.isNullOrBlank()) return emptyList()
        return try {
            json.decodeFromString(value)
        } catch (e: Exception) {
            emptyList()
        }
    }
}
