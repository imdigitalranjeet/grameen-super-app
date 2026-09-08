package com.example.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.BahiKhataItem
import com.example.data.model.ExpenseItem
import com.example.data.model.GiftItem
import com.example.data.model.PlantationCrop
import com.example.data.model.ReminderItem
import kotlinx.coroutines.flow.Flow

@Dao
interface ExpenseDao {
    @Query("SELECT * FROM expenses ORDER BY date DESC, id DESC")
    fun getAllExpenses(): Flow<List<ExpenseItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExpense(item: ExpenseItem)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(items: List<ExpenseItem>)

    @Update
    suspend fun updateExpense(item: ExpenseItem)

    @Delete
    suspend fun deleteExpense(item: ExpenseItem)

    @Query("DELETE FROM expenses WHERE id = :id")
    suspend fun deleteById(id: String)
}

@Dao
interface CropDao {
    @Query("SELECT * FROM crops ORDER BY plantingDate DESC, id DESC")
    fun getAllCrops(): Flow<List<PlantationCrop>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCrop(crop: PlantationCrop)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(crops: List<PlantationCrop>)

    @Update
    suspend fun updateCrop(crop: PlantationCrop)

    @Delete
    suspend fun deleteCrop(crop: PlantationCrop)

    @Query("DELETE FROM crops WHERE id = :id")
    suspend fun deleteById(id: String)
}

@Dao
interface ReminderDao {
    @Query("SELECT * FROM reminders ORDER BY completed ASC, dueDate ASC")
    fun getAllReminders(): Flow<List<ReminderItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReminder(item: ReminderItem)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(items: List<ReminderItem>)

    @Update
    suspend fun updateReminder(item: ReminderItem)

    @Delete
    suspend fun deleteReminder(item: ReminderItem)

    @Query("DELETE FROM reminders WHERE id = :id")
    suspend fun deleteById(id: String)
}

@Dao
interface GiftDao {
    @Query("SELECT * FROM gifts ORDER BY date DESC, id DESC")
    fun getAllGifts(): Flow<List<GiftItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertGift(item: GiftItem)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(items: List<GiftItem>)

    @Update
    suspend fun updateGift(item: GiftItem)

    @Delete
    suspend fun deleteGift(item: GiftItem)

    @Query("DELETE FROM gifts WHERE id = :id")
    suspend fun deleteById(id: String)
}

@Dao
interface BahiKhataDao {
    @Query("SELECT * FROM bahi_khata ORDER BY settled ASC, date DESC")
    fun getAllBahiKhata(): Flow<List<BahiKhataItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBahiKhata(item: BahiKhataItem)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(items: List<BahiKhataItem>)

    @Update
    suspend fun updateBahiKhata(item: BahiKhataItem)

    @Delete
    suspend fun deleteBahiKhata(item: BahiKhataItem)

    @Query("DELETE FROM bahi_khata WHERE id = :id")
    suspend fun deleteById(id: String)
}
