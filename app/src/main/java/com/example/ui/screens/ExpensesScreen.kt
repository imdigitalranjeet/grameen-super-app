package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Agriculture
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocalGasStation
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.MonetizationOn
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.data.model.ExpenseItem
import com.example.data.model.Language
import com.example.ui.ActiveDialog
import com.example.ui.GraminViewModel
import com.example.ui.theme.AmberSecondary
import com.example.ui.theme.FarmGreenContainer
import com.example.ui.theme.FarmGreenOnContainer
import com.example.ui.theme.FarmGreenPrimary
import com.example.ui.theme.StatusAmber
import com.example.ui.theme.StatusBlue
import com.example.ui.theme.StatusGreen
import com.example.ui.theme.StatusRed

@Composable
fun ExpensesScreen(viewModel: GraminViewModel) {
    val language by viewModel.language.collectAsState()
    val isHi = language == Language.HI

    val expenses by viewModel.expenses.collectAsState()
    val filter by viewModel.expenseFilter.collectAsState()

    val filteredList = expenses.filter {
        when (filter) {
            "farming" -> it.isFarming
            "household" -> !it.isFarming
            else -> true
        }
    }

    val totalAmt = filteredList.sumOf { it.amount }
    val farmAmt = expenses.filter { it.isFarming }.sumOf { it.amount }
    val homeAmt = expenses.filter { !it.isFarming }.sumOf { it.amount }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.openDialog(ActiveDialog.AddExpense) },
                containerColor = FarmGreenPrimary,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_add_expense")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Expense")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(8.dp))

            // Filter Chips
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = filter == "all",
                    onClick = { viewModel.setExpenseFilter("all") },
                    label = { Text(if (isHi) "सभी खर्च (${expenses.size})" else "All (${expenses.size})") },
                    modifier = Modifier.testTag("filter_all_expenses")
                )
                FilterChip(
                    selected = filter == "farming",
                    onClick = { viewModel.setExpenseFilter("farming") },
                    label = { Text(if (isHi) "🌾 खेती खर्च" else "🌾 Farm") },
                    modifier = Modifier.testTag("filter_farm_expenses")
                )
                FilterChip(
                    selected = filter == "household",
                    onClick = { viewModel.setExpenseFilter("household") },
                    label = { Text(if (isHi) "🏠 घरेलू खर्च" else "🏠 Household") },
                    modifier = Modifier.testTag("filter_home_expenses")
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Total Spend Header Card
            ElevatedCard(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.elevatedCardColors(containerColor = FarmGreenContainer)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (isHi) "कुल दर्ज खर्च" else "Total Expenses",
                            style = MaterialTheme.typography.labelMedium,
                            color = FarmGreenOnContainer.copy(alpha = 0.8f)
                        )
                        Text(
                            text = "₹${totalAmt.toInt()}",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = FarmGreenOnContainer
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "🌾 Farm: ₹${farmAmt.toInt()}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold,
                            color = StatusGreen
                        )
                        Text(
                            text = "🏠 Home: ₹${homeAmt.toInt()}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold,
                            color = AmberSecondary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Expense Items List
            if (filteredList.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (isHi) "कोई खर्च नहीं मिला। + बटन दबाकर नया खर्च जोड़ें।" else "No expenses found. Tap + to add.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(filteredList, key = { it.id }) { item ->
                        ExpenseCard(item = item, isHi = isHi, onDelete = { viewModel.deleteExpense(item.id) })
                    }
                    item { Spacer(modifier = Modifier.height(72.dp)) }
                }
            }
        }
    }
}

@Composable
fun ExpenseCard(item: ExpenseItem, isHi: Boolean, onDelete: () -> Unit) {
    val icon = when (item.category.lowercase()) {
        "fertilizer", "seeds" -> Icons.Default.Spa
        "diesel_tractor" -> Icons.Default.LocalGasStation
        "labor" -> Icons.Default.Agriculture
        "groceries" -> Icons.Default.ShoppingCart
        "medical" -> Icons.Default.MedicalServices
        "education" -> Icons.Default.School
        else -> Icons.Default.MonetizationOn
    }

    val iconColor = if (item.isFarming) FarmGreenPrimary else AmberSecondary

    Card(
        modifier = Modifier.fillMaxWidth().testTag("expense_card_${item.id}"),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(iconColor.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = item.category,
                    tint = iconColor,
                    modifier = Modifier.size(22.dp)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = item.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.weight(1f)
                    )
                    Text(
                        text = "₹${item.amount.toInt()}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = if (item.isFarming) FarmGreenPrimary else AmberSecondary
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = if (item.isFarming) Color(0xFFDCFCE7) else Color(0xFFFEF3C7)
                        ) {
                            Text(
                                text = if (item.isFarming) "🌾 Farm" else "🏠 Home",
                                style = MaterialTheme.typography.labelSmall,
                                color = if (item.isFarming) FarmGreenPrimary else AmberSecondary,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                fontWeight = FontWeight.Bold
                            )
                        }

                        if (item.cropOrPlot != null) {
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = Color(0xFFEFF6FF)
                            ) {
                                Text(
                                    text = item.cropOrPlot,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = StatusBlue,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }

                    Text(
                        text = item.date,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    )
                }

                if (!item.notes.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "📝 ${item.notes}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }
            }

            IconButton(onClick = onDelete) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Delete",
                    tint = Color.Gray.copy(alpha = 0.6f),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
