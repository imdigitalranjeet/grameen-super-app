package com.example.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.example.data.model.BahiKhataItem
import com.example.data.model.ExpenseItem
import com.example.data.model.FertilizerLog
import com.example.data.model.GiftItem
import com.example.data.model.HarvestRecord
import com.example.data.model.Language
import com.example.data.model.PlantationCrop
import com.example.data.model.ReminderItem
import com.example.data.model.SprayLog
import com.example.ui.ActiveDialog
import com.example.ui.GraminViewModel
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Composable
fun GraminDialogHost(
    viewModel: GraminViewModel,
    activeDialog: ActiveDialog,
    language: Language
) {
    val isHi = language == Language.HI
    val today = remember { LocalDate.now().format(DateTimeFormatter.ISO_DATE) }

    when (activeDialog) {
        is ActiveDialog.None -> {}

        is ActiveDialog.AddExpense -> {
            var title by remember { mutableStateOf("") }
            var amount by remember { mutableStateOf("") }
            var isFarming by remember { mutableStateOf(true) }
            var category by remember { mutableStateOf("fertilizer") }
            var paymentMode by remember { mutableStateOf("cash") }
            var cropOrPlot by remember { mutableStateOf("") }
            var notes by remember { mutableStateOf("") }

            AlertDialog(
                onDismissRequest = { viewModel.closeDialog() },
                title = {
                    Text(if (isHi) "नया खर्च जोड़ें (Add Expense)" else "Add New Expense")
                },
                text = {
                    Column(
                        modifier = Modifier
                            .verticalScroll(rememberScrollState())
                            .fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            FilterChip(
                                selected = isFarming,
                                onClick = { isFarming = true },
                                label = { Text(if (isHi) "🌾 खेती खर्च" else "🌾 Farm Expense") },
                                modifier = Modifier.testTag("expense_type_farm")
                            )
                            FilterChip(
                                selected = !isFarming,
                                onClick = { isFarming = false },
                                label = { Text(if (isHi) "🏠 घरेलू खर्च" else "🏠 Household") },
                                modifier = Modifier.testTag("expense_type_home")
                            )
                        }

                        OutlinedTextField(
                            value = title,
                            onValueChange = { title = it },
                            label = { Text(if (isHi) "खर्च का विवरण (Title/Item)" else "Title / Item Description") },
                            modifier = Modifier.fillMaxWidth().testTag("expense_title_input"),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = amount,
                            onValueChange = { amount = it },
                            label = { Text(if (isHi) "राशि (₹ Amount)" else "Amount (₹)") },
                            modifier = Modifier.fillMaxWidth().testTag("expense_amount_input"),
                            singleLine = true
                        )

                        if (isFarming) {
                            OutlinedTextField(
                                value = cropOrPlot,
                                onValueChange = { cropOrPlot = it },
                                label = { Text(if (isHi) "खेत / फसल (Plot or Crop)" else "Plot or Crop Name") },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true
                            )
                        }

                        OutlinedTextField(
                            value = notes,
                            onValueChange = { notes = it },
                            label = { Text(if (isHi) "अतिरिक्त नोट (Notes / Shop)" else "Notes / Shop Name") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val amt = amount.toDoubleOrNull() ?: 0.0
                            if (title.isNotBlank() && amt > 0) {
                                viewModel.addExpense(
                                    ExpenseItem(
                                        title = title.trim(),
                                        category = if (isFarming) "fertilizer" else "groceries",
                                        amount = amt,
                                        date = today,
                                        isFarming = isFarming,
                                        paymentMode = paymentMode,
                                        cropOrPlot = if (cropOrPlot.isNotBlank()) cropOrPlot.trim() else null,
                                        notes = if (notes.isNotBlank()) notes.trim() else null
                                    )
                                )
                            }
                        },
                        modifier = Modifier.testTag("expense_submit_btn")
                    ) {
                        Text(if (isHi) "सुरक्षित करें (Save)" else "Save")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.closeDialog() }) {
                        Text(if (isHi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }

        is ActiveDialog.AddCrop -> {
            var plotName by remember { mutableStateOf("") }
            var cropName by remember { mutableStateOf("Wheat (गेहूं)") }
            var areaValue by remember { mutableStateOf("2.0") }
            var areaUnit by remember { mutableStateOf("Acre") }
            var soilType by remember { mutableStateOf("Alluvial Loam") }
            var variety by remember { mutableStateOf("") }

            AlertDialog(
                onDismissRequest = { viewModel.closeDialog() },
                title = { Text(if (isHi) "नई फसल दर्ज करें (Add Plantation)" else "Add New Plantation Crop") },
                text = {
                    Column(
                        modifier = Modifier
                            .verticalScroll(rememberScrollState())
                            .fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = plotName,
                            onValueChange = { plotName = it },
                            label = { Text(if (isHi) "खेत का नाम (Plot Name)" else "Plot Name") },
                            modifier = Modifier.fillMaxWidth().testTag("crop_plot_input"),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = cropName,
                            onValueChange = { cropName = it },
                            label = { Text(if (isHi) "फसल का नाम (Crop Name)" else "Crop Name") },
                            modifier = Modifier.fillMaxWidth().testTag("crop_name_input"),
                            singleLine = true
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = areaValue,
                                onValueChange = { areaValue = it },
                                label = { Text(if (isHi) "रकबा (Area)" else "Area") },
                                modifier = Modifier.weight(1f).testTag("crop_area_input"),
                                singleLine = true
                            )
                            FilterChip(
                                selected = areaUnit == "Acre",
                                onClick = { areaUnit = "Acre" },
                                label = { Text("Acre") },
                                modifier = Modifier.align(Alignment.CenterVertically)
                            )
                            FilterChip(
                                selected = areaUnit == "Bigha",
                                onClick = { areaUnit = "Bigha" },
                                label = { Text("Bigha") },
                                modifier = Modifier.align(Alignment.CenterVertically)
                            )
                        }

                        OutlinedTextField(
                            value = variety,
                            onValueChange = { variety = it },
                            label = { Text(if (isHi) "किस्म / बीज (Variety)" else "Variety / Hybrid") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = soilType,
                            onValueChange = { soilType = it },
                            label = { Text(if (isHi) "मिट्टी का प्रकार (Soil Type)" else "Soil Type") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val area = areaValue.toDoubleOrNull() ?: 1.0
                            if (plotName.isNotBlank() && cropName.isNotBlank()) {
                                viewModel.addCrop(
                                    PlantationCrop(
                                        plotName = plotName.trim(),
                                        areaValue = area,
                                        areaUnit = areaUnit,
                                        soilType = soilType.trim(),
                                        cropName = cropName.trim(),
                                        variety = if (variety.isNotBlank()) variety.trim() else null,
                                        plantingDate = today,
                                        expectedHarvestDate = LocalDate.now().plusMonths(4).format(DateTimeFormatter.ISO_DATE),
                                        status = "sown"
                                    )
                                )
                            }
                        },
                        modifier = Modifier.testTag("crop_submit_btn")
                    ) {
                        Text(if (isHi) "फसल जोड़ें" else "Add Crop")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.closeDialog() }) {
                        Text(if (isHi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }

        is ActiveDialog.AddFertilizer -> {
            val cropId = activeDialog.cropId
            val cropName = activeDialog.cropName
            var fertType by remember { mutableStateOf("Neem Coated Urea") }
            var qty by remember { mutableStateOf("2") }
            var cost by remember { mutableStateOf("540") }
            var stage by remember { mutableStateOf("First Irrigation Top Dressing") }
            var alsoAddExpense by remember { mutableStateOf(true) }

            AlertDialog(
                onDismissRequest = { viewModel.closeDialog() },
                title = { Text(if (isHi) "खाद लॉग जोड़ें ($cropName)" else "Add Fertilizer Log ($cropName)") },
                text = {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = fertType,
                            onValueChange = { fertType = it },
                            label = { Text(if (isHi) "खाद का नाम (Fertilizer)" else "Fertilizer Type") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = qty,
                            onValueChange = { qty = it },
                            label = { Text(if (isHi) "मात्रा बोरी/किलो (Quantity)" else "Quantity (Bags)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = cost,
                            onValueChange = { cost = it },
                            label = { Text(if (isHi) "कुल लागत (₹ Cost)" else "Total Cost (₹)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = stage,
                            onValueChange = { stage = it },
                            label = { Text(if (isHi) "फसल अवस्था (Growth Stage)" else "Crop Stage") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = alsoAddExpense,
                                onCheckedChange = { alsoAddExpense = it }
                            )
                            Spacer(Modifier.width(6.dp))
                            Text(if (isHi) "इसे खेती खर्च में भी जोड़ें" else "Also record in Farm Expenses")
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val q = qty.toDoubleOrNull() ?: 1.0
                            val c = cost.toDoubleOrNull() ?: 0.0
                            viewModel.addFertilizerLog(
                                cropId,
                                FertilizerLog(
                                    date = today,
                                    fertilizerType = fertType.trim(),
                                    quantity = q,
                                    unit = "bags",
                                    cost = c,
                                    stage = stage.trim()
                                ),
                                alsoAddExpense
                            )
                        }
                    ) {
                        Text(if (isHi) "खाद दर्ज करें" else "Save Log")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.closeDialog() }) {
                        Text(if (isHi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }

        is ActiveDialog.AddSpray -> {
            val cropId = activeDialog.cropId
            val cropName = activeDialog.cropName
            var sprayName by remember { mutableStateOf("Propiconazole 25% EC") }
            var purpose by remember { mutableStateOf("Rust / Fungal Prevention") }
            var cost by remember { mutableStateOf("650") }
            var alsoAddExpense by remember { mutableStateOf(true) }

            AlertDialog(
                onDismissRequest = { viewModel.closeDialog() },
                title = { Text(if (isHi) "स्प्रे / कीटनाशक लॉग ($cropName)" else "Add Spray Log ($cropName)") },
                text = {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = sprayName,
                            onValueChange = { sprayName = it },
                            label = { Text(if (isHi) "दवा / कीटनाशक का नाम" else "Medicine / Pesticide Name") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = purpose,
                            onValueChange = { purpose = it },
                            label = { Text(if (isHi) "उद्देश्य / बीमारी (Purpose)" else "Target Pest or Disease") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = cost,
                            onValueChange = { cost = it },
                            label = { Text(if (isHi) "लागत (₹ Cost)" else "Cost (₹)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = alsoAddExpense,
                                onCheckedChange = { alsoAddExpense = it }
                            )
                            Spacer(Modifier.width(6.dp))
                            Text(if (isHi) "इसे खेती खर्च में भी जोड़ें" else "Also record in Farm Expenses")
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val c = cost.toDoubleOrNull() ?: 0.0
                            viewModel.addSprayLog(
                                cropId,
                                SprayLog(
                                    date = today,
                                    name = sprayName.trim(),
                                    purpose = purpose.trim(),
                                    cost = c
                                ),
                                alsoAddExpense
                            )
                        }
                    ) {
                        Text(if (isHi) "स्प्रे दर्ज करें" else "Save Spray")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.closeDialog() }) {
                        Text(if (isHi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }

        is ActiveDialog.AddHarvest -> {
            val cropId = activeDialog.cropId
            val cropName = activeDialog.cropName
            var yieldAmount by remember { mutableStateOf("50") }
            var sellingRate by remember { mutableStateOf("2275") }
            var mandi by remember { mutableStateOf("Kisan Mandi Yard") }

            AlertDialog(
                onDismissRequest = { viewModel.closeDialog() },
                title = { Text(if (isHi) "पैदावार / कटाई दर्ज करें ($cropName)" else "Record Harvest ($cropName)") },
                text = {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = yieldAmount,
                            onValueChange = { yieldAmount = it },
                            label = { Text(if (isHi) "कुल उपज कुंतल में (Yield Quintal)" else "Yield in Quintal") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = sellingRate,
                            onValueChange = { sellingRate = it },
                            label = { Text(if (isHi) "बिक्री भाव ₹ प्रति कुंतल (Rate/Q)" else "Rate per Quintal (₹)") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = mandi,
                            onValueChange = { mandi = it },
                            label = { Text(if (isHi) "मंडी या खरीदार (Mandi/Buyer)" else "Mandi / Buyer Name") },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val y = yieldAmount.toDoubleOrNull() ?: 0.0
                            val r = sellingRate.toDoubleOrNull() ?: 0.0
                            val total = y * r
                            viewModel.addHarvestRecord(
                                cropId,
                                HarvestRecord(
                                    date = today,
                                    yieldAmount = y,
                                    unit = "Quintal",
                                    sellingRatePerUnit = r,
                                    totalRevenue = total,
                                    buyerOrMandi = mandi.trim()
                                )
                            )
                        }
                    ) {
                        Text(if (isHi) "कटाई दर्ज करें" else "Save Harvest")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.closeDialog() }) {
                        Text(if (isHi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }

        is ActiveDialog.AddReminder -> {
            var title by remember { mutableStateOf("") }
            var dueDate by remember { mutableStateOf(LocalDate.now().plusDays(2).format(DateTimeFormatter.ISO_DATE)) }
            var priority by remember { mutableStateOf("high") }
            var category by remember { mutableStateOf("irrigation_due") }

            AlertDialog(
                onDismissRequest = { viewModel.closeDialog() },
                title = { Text(if (isHi) "नया रिमाइंडर जोड़ें" else "Add New Reminder") },
                text = {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        OutlinedTextField(
                            value = title,
                            onValueChange = { title = it },
                            label = { Text(if (isHi) "कार्य विवरण (Task / Reminder)" else "Task Description") },
                            modifier = Modifier.fillMaxWidth().testTag("reminder_title_input"),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = dueDate,
                            onValueChange = { dueDate = it },
                            label = { Text(if (isHi) "तारीख (YYYY-MM-DD)" else "Due Date (YYYY-MM-DD)") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            FilterChip(
                                selected = priority == "high",
                                onClick = { priority = "high" },
                                label = { Text(if (isHi) "🔴 जरूरी" else "🔴 High") }
                            )
                            FilterChip(
                                selected = priority == "medium",
                                onClick = { priority = "medium" },
                                label = { Text(if (isHi) "🟡 सामान्य" else "🟡 Medium") }
                            )
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (title.isNotBlank()) {
                                viewModel.addReminder(
                                    ReminderItem(
                                        title = title.trim(),
                                        category = category,
                                        dueDate = dueDate.trim(),
                                        priority = priority,
                                        completed = false
                                    )
                                )
                            }
                        },
                        modifier = Modifier.testTag("reminder_submit_btn")
                    ) {
                        Text(if (isHi) "रिमाइंडर बनाएँ" else "Save Reminder")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.closeDialog() }) {
                        Text(if (isHi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }

        is ActiveDialog.AddGift -> {
            var personName by remember { mutableStateOf("") }
            var village by remember { mutableStateOf("") }
            var occasion by remember { mutableStateOf("Wedding / शादी") }
            var amount by remember { mutableStateOf("2100") }
            var isGiven by remember { mutableStateOf(true) }

            AlertDialog(
                onDismissRequest = { viewModel.closeDialog() },
                title = { Text(if (isHi) "शगुन / न्योता दर्ज करें" else "Record Gift / Shagun") },
                text = {
                    Column(
                        modifier = Modifier
                            .verticalScroll(rememberScrollState())
                            .fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            FilterChip(
                                selected = isGiven,
                                onClick = { isGiven = true },
                                label = { Text(if (isHi) "📤 दिया (Given)" else "📤 Given") }
                            )
                            FilterChip(
                                selected = !isGiven,
                                onClick = { isGiven = false },
                                label = { Text(if (isHi) "📥 मिला (Received)" else "📥 Received") }
                            )
                        }

                        OutlinedTextField(
                            value = personName,
                            onValueChange = { personName = it },
                            label = { Text(if (isHi) "व्यक्ति का नाम (Person Name)" else "Person Name") },
                            modifier = Modifier.fillMaxWidth().testTag("gift_name_input"),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = village,
                            onValueChange = { village = it },
                            label = { Text(if (isHi) "गाँव / रिश्ता (Village / Relation)" else "Village / Relation") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = occasion,
                            onValueChange = { occasion = it },
                            label = { Text(if (isHi) "अवसर (Occasion - विवाह, मुंडन)" else "Occasion") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = amount,
                            onValueChange = { amount = it },
                            label = { Text(if (isHi) "शगुन राशि ₹ (Amount)" else "Shagun Amount ₹") },
                            modifier = Modifier.fillMaxWidth().testTag("gift_amount_input"),
                            singleLine = true
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val amt = amount.toDoubleOrNull() ?: 0.0
                            if (personName.isNotBlank() && amt > 0) {
                                viewModel.addGift(
                                    GiftItem(
                                        type = if (isGiven) "given" else "received",
                                        personName = personName.trim(),
                                        villageOrRelation = village.trim(),
                                        occasion = occasion.trim(),
                                        date = today,
                                        amountOrValue = amt,
                                        counterGiftSettled = false
                                    )
                                )
                            }
                        },
                        modifier = Modifier.testTag("gift_submit_btn")
                    ) {
                        Text(if (isHi) "शगुन सुरक्षित करें" else "Save Shagun")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.closeDialog() }) {
                        Text(if (isHi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }

        is ActiveDialog.AddBahiKhata -> {
            var personName by remember { mutableStateOf("") }
            var phone by remember { mutableStateOf("") }
            var amount by remember { mutableStateOf("") }
            var isGiven by remember { mutableStateOf(true) }
            var purpose by remember { mutableStateOf("") }

            AlertDialog(
                onDismissRequest = { viewModel.closeDialog() },
                title = { Text(if (isHi) "बही-खाता (उधार/जमा) प्रविष्टि" else "Add Bahi Khata Entry") },
                text = {
                    Column(
                        modifier = Modifier
                            .verticalScroll(rememberScrollState())
                            .fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            FilterChip(
                                selected = isGiven,
                                onClick = { isGiven = true },
                                label = { Text(if (isHi) "📤 आपने दिया (Gave)" else "📤 You Gave") }
                            )
                            FilterChip(
                                selected = !isGiven,
                                onClick = { isGiven = false },
                                label = { Text(if (isHi) "📥 आपने लिया (Took)" else "📥 You Took") }
                            )
                        }

                        OutlinedTextField(
                            value = personName,
                            onValueChange = { personName = it },
                            label = { Text(if (isHi) "व्यक्ति / व्यापारी का नाम" else "Person / Trader Name") },
                            modifier = Modifier.fillMaxWidth().testTag("bahi_name_input"),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = amount,
                            onValueChange = { amount = it },
                            label = { Text(if (isHi) "राशि ₹ (Amount)" else "Amount ₹") },
                            modifier = Modifier.fillMaxWidth().testTag("bahi_amount_input"),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = purpose,
                            onValueChange = { purpose = it },
                            label = { Text(if (isHi) "प्रयोजन (Purpose - खाद, किराना, डीजल)" else "Purpose / Item") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = phone,
                            onValueChange = { phone = it },
                            label = { Text(if (isHi) "फोन नंबर (वैकल्पिक)" else "Phone Number (Optional)") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            val amt = amount.toDoubleOrNull() ?: 0.0
                            if (personName.isNotBlank() && amt > 0) {
                                viewModel.addBahiKhata(
                                    BahiKhataItem(
                                        personName = personName.trim(),
                                        phone = if (phone.isNotBlank()) phone.trim() else null,
                                        type = if (isGiven) "you_gave" else "you_took",
                                        amount = amt,
                                        date = today,
                                        purpose = if (purpose.isNotBlank()) purpose.trim() else "General Village Ledger",
                                        settled = false
                                    )
                                )
                            }
                        },
                        modifier = Modifier.testTag("bahi_submit_btn")
                    ) {
                        Text(if (isHi) "खाता जोड़ें" else "Save Ledger Entry")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { viewModel.closeDialog() }) {
                        Text(if (isHi) "रद्द करें" else "Cancel")
                    }
                }
            )
        }
    }
}
