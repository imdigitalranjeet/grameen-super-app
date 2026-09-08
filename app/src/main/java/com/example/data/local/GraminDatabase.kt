package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.example.data.model.BahiKhataItem
import com.example.data.model.ExpenseItem
import com.example.data.model.GiftItem
import com.example.data.model.PlantationCrop
import com.example.data.model.ReminderItem

@Database(
    entities = [
        ExpenseItem::class,
        PlantationCrop::class,
        ReminderItem::class,
        GiftItem::class,
        BahiKhataItem::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class GraminDatabase : RoomDatabase() {
    abstract fun expenseDao(): ExpenseDao
    abstract fun cropDao(): CropDao
    abstract fun reminderDao(): ReminderDao
    abstract fun giftDao(): GiftDao
    abstract fun bahiKhataDao(): BahiKhataDao

    companion object {
        @Volatile
        private var INSTANCE: GraminDatabase? = null

        fun getDatabase(context: Context): GraminDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    GraminDatabase::class.java,
                    "gramin_village_db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
