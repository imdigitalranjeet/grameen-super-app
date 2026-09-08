package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.GraminDatabase
import com.example.data.model.BahiKhataItem
import com.example.data.model.DayForecast
import com.example.data.model.ExpenseItem
import com.example.data.model.FertilizerLog
import com.example.data.model.GiftItem
import com.example.data.model.HarvestRecord
import com.example.data.model.Language
import com.example.data.model.MandiPrice
import com.example.data.model.PlantationCrop
import com.example.data.model.ReminderItem
import com.example.data.model.SprayLog
import com.example.data.repository.FertilizerCalculationResult
import com.example.data.repository.GraminRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class GraminTab {
    OVERVIEW,
    EXPENSES,
    PLANTATION,
    REMINDERS,
    GIFTS,
    TOOLS
}

sealed interface ActiveDialog {
    data object None : ActiveDialog
    data object AddExpense : ActiveDialog
    data object AddCrop : ActiveDialog
    data class AddFertilizer(val cropId: String, val cropName: String) : ActiveDialog
    data class AddSpray(val cropId: String, val cropName: String) : ActiveDialog
    data class AddHarvest(val cropId: String, val cropName: String) : ActiveDialog
    data object AddReminder : ActiveDialog
    data object AddGift : ActiveDialog
    data object AddBahiKhata : ActiveDialog
}

data class ChatMessage(
    val isUser: Boolean,
    val text: String,
    val timestamp: String = "Just now"
)

class GraminViewModel(application: Application) : AndroidViewModel(application) {
    private val db = GraminDatabase.getDatabase(application)
    val repository = GraminRepository(db)

    private val _language = MutableStateFlow(Language.HI)
    val language: StateFlow<Language> = _language.asStateFlow()

    private val _currentTab = MutableStateFlow(GraminTab.OVERVIEW)
    val currentTab: StateFlow<GraminTab> = _currentTab.asStateFlow()

    val expenses: StateFlow<List<ExpenseItem>> = repository.allExpenses
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val crops: StateFlow<List<PlantationCrop>> = repository.allCrops
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val reminders: StateFlow<List<ReminderItem>> = repository.allReminders
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val gifts: StateFlow<List<GiftItem>> = repository.allGifts
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val bahiKhata: StateFlow<List<BahiKhataItem>> = repository.allBahiKhata
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Filters
    private val _expenseFilter = MutableStateFlow("all") // all, farming, household
    val expenseFilter: StateFlow<String> = _expenseFilter.asStateFlow()

    private val _reminderFilter = MutableStateFlow("all") // all, pending, completed
    val reminderFilter: StateFlow<String> = _reminderFilter.asStateFlow()

    private val _giftFilter = MutableStateFlow("all") // all, given, received
    val giftFilter: StateFlow<String> = _giftFilter.asStateFlow()

    private val _bahiFilter = MutableStateFlow("all") // all, you_gave, you_took, pending
    val bahiFilter: StateFlow<String> = _bahiFilter.asStateFlow()

    // Dialog state
    private val _activeDialog = MutableStateFlow<ActiveDialog>(ActiveDialog.None)
    val activeDialog: StateFlow<ActiveDialog> = _activeDialog.asStateFlow()

    // Fertilizer calculator
    private val _calcCrop = MutableStateFlow("Wheat (गेहूं)")
    val calcCrop: StateFlow<String> = _calcCrop.asStateFlow()

    private val _calcArea = MutableStateFlow("3.0")
    val calcArea: StateFlow<String> = _calcArea.asStateFlow()

    private val _calcUnit = MutableStateFlow("Acre")
    val calcUnit: StateFlow<String> = _calcUnit.asStateFlow()

    private val _calcResult = MutableStateFlow<FertilizerCalculationResult?>(null)
    val calcResult: StateFlow<FertilizerCalculationResult?> = _calcResult.asStateFlow()

    // Kisan AI Advisor Chat
    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(
        listOf(
            ChatMessage(
                isUser = false,
                text = "राम-राम किसान भाई! मैं आपका ग्रामी AI कृषि सलाहकार हूँ। गेहूं, सरसों, खाद की मात्रा, कीट-रोग या सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछें।"
            )
        )
    )
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    private val _isAiThinking = MutableStateFlow(false)
    val isAiThinking: StateFlow<Boolean> = _isAiThinking.asStateFlow()

    // Static / domain data
    val mandiPrices: List<MandiPrice> get() = repository.getMandiPrices()
    val weatherForecast: List<DayForecast> get() = repository.getWeatherForecast(_language.value)

    init {
        viewModelScope.launch {
            repository.seedInitialDataIfEmpty()
            calculateFertilizerNow()
        }
    }

    fun toggleLanguage() {
        val next = if (_language.value == Language.HI) Language.EN else Language.HI
        _language.value = next
        // Refresh initial greeting if single message
        if (_chatMessages.value.size == 1 && !_chatMessages.value[0].isUser) {
            _chatMessages.value = listOf(
                ChatMessage(
                    isUser = false,
                    text = if (next == Language.HI)
                        "राम-राम किसान भाई! मैं आपका ग्रामी AI कृषि सलाहकार हूँ। गेहूं, सरसों, खाद की मात्रा, कीट-रोग या सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछें।"
                    else
                        "Welcome Kisan brother! I am your Gramin AI Agriculture Advisor. Ask me anything about crop nutrition, spray schedules, pest control, or government schemes."
                )
            )
        }
        calculateFertilizerNow()
    }

    fun setTab(tab: GraminTab) {
        _currentTab.value = tab
    }

    fun setExpenseFilter(filter: String) { _expenseFilter.value = filter }
    fun setReminderFilter(filter: String) { _reminderFilter.value = filter }
    fun setGiftFilter(filter: String) { _giftFilter.value = filter }
    fun setBahiFilter(filter: String) { _bahiFilter.value = filter }

    fun openDialog(dialog: ActiveDialog) { _activeDialog.value = dialog }
    fun closeDialog() { _activeDialog.value = ActiveDialog.None }

    // CRUD operations
    fun addExpense(item: ExpenseItem) {
        viewModelScope.launch {
            repository.insertExpense(item)
            closeDialog()
        }
    }

    fun deleteExpense(id: String) {
        viewModelScope.launch { repository.deleteExpense(id) }
    }

    fun addCrop(crop: PlantationCrop) {
        viewModelScope.launch {
            repository.insertCrop(crop)
            closeDialog()
        }
    }

    fun deleteCrop(id: String) {
        viewModelScope.launch { repository.deleteCrop(id) }
    }

    fun addFertilizerLog(cropId: String, log: FertilizerLog, alsoAddExpense: Boolean) {
        viewModelScope.launch {
            repository.addFertilizerLog(cropId, log, alsoAddExpense)
            closeDialog()
        }
    }

    fun addSprayLog(cropId: String, log: SprayLog, alsoAddExpense: Boolean) {
        viewModelScope.launch {
            repository.addSprayLog(cropId, log, alsoAddExpense)
            closeDialog()
        }
    }

    fun addHarvestRecord(cropId: String, record: HarvestRecord) {
        viewModelScope.launch {
            repository.addHarvestRecord(cropId, record)
            closeDialog()
        }
    }

    fun addReminder(item: ReminderItem) {
        viewModelScope.launch {
            repository.insertReminder(item)
            closeDialog()
        }
    }

    fun toggleReminder(item: ReminderItem) {
        viewModelScope.launch { repository.toggleReminder(item) }
    }

    fun deleteReminder(id: String) {
        viewModelScope.launch { repository.deleteReminder(id) }
    }

    fun addGift(item: GiftItem) {
        viewModelScope.launch {
            repository.insertGift(item)
            closeDialog()
        }
    }

    fun toggleGiftSettled(item: GiftItem) {
        viewModelScope.launch { repository.toggleGiftSettled(item) }
    }

    fun deleteGift(id: String) {
        viewModelScope.launch { repository.deleteGift(id) }
    }

    fun addBahiKhata(item: BahiKhataItem) {
        viewModelScope.launch {
            repository.insertBahiKhata(item)
            closeDialog()
        }
    }

    fun toggleBahiSettled(item: BahiKhataItem) {
        viewModelScope.launch { repository.toggleBahiSettled(item) }
    }

    fun deleteBahiKhata(id: String) {
        viewModelScope.launch { repository.deleteBahiKhata(id) }
    }

    // Fertilizer Calc
    fun updateCalcParams(crop: String, area: String, unit: String) {
        _calcCrop.value = crop
        _calcArea.value = area
        _calcUnit.value = unit
        calculateFertilizerNow()
    }

    private fun calculateFertilizerNow() {
        val area = _calcArea.value.toDoubleOrNull() ?: 1.0
        _calcResult.value = repository.calculateFertilizer(
            _calcCrop.value,
            area,
            _calcUnit.value,
            _language.value
        )
    }

    // Chat
    fun askKisanAI(question: String) {
        if (question.isBlank()) return
        val userMsg = ChatMessage(isUser = true, text = question)
        _chatMessages.value = _chatMessages.value + userMsg
        _isAiThinking.value = true

        viewModelScope.launch {
            kotlinx.coroutines.delay(600) // Realistic conversational pause
            val answer = repository.answerKisanQuestion(question, _language.value)
            val aiMsg = ChatMessage(isUser = false, text = answer)
            _chatMessages.value = _chatMessages.value + aiMsg
            _isAiThinking.value = false
        }
    }
}
