package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Agriculture
import androidx.compose.material.icons.filled.Alarm
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Cloud
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.MonetizationOn
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material.icons.filled.WbSunny
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
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
import androidx.compose.ui.unit.sp
import com.example.data.model.Language
import com.example.ui.ActiveDialog
import com.example.ui.GraminTab
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
fun OverviewScreen(viewModel: GraminViewModel) {
    val language by viewModel.language.collectAsState()
    val isHi = language == Language.HI

    val expenses by viewModel.expenses.collectAsState()
    val crops by viewModel.crops.collectAsState()
    val reminders by viewModel.reminders.collectAsState()
    val bahiKhata by viewModel.bahiKhata.collectAsState()
    val weatherList = viewModel.weatherForecast

    val totalExpense = expenses.sumOf { it.amount }
    val farmExpense = expenses.filter { it.isFarming }.sumOf { it.amount }
    val homeExpense = expenses.filter { !it.isFarming }.sumOf { it.amount }

    val pendingReminders = reminders.filter { !it.completed }
    val totalGiven = bahiKhata.filter { it.type == "you_gave" && !it.settled }.sumOf { it.amount }
    val totalTaken = bahiKhata.filter { it.type == "you_took" && !it.settled }.sumOf { it.amount }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            // Greeting Banner
            ElevatedCard(
                modifier = Modifier.fillMaxWidth().testTag("greeting_card"),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.elevatedCardColors(containerColor = FarmGreenContainer)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(CircleShape)
                            .background(FarmGreenPrimary),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Agriculture,
                            contentDescription = "Farm",
                            tint = Color.White,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = if (isHi) "राम-राम किसान भाई! 🙏" else "Welcome Kisan Brother! 🌾",
                            style = MaterialTheme.typography.titleLarge,
                            color = FarmGreenOnContainer,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (isHi) "ग्रामी सुपर ऐप - खेती, खर्च व बही-खाता" else "Gramin - Smart Farm, Ledger & Crop Manager",
                            style = MaterialTheme.typography.bodyMedium,
                            color = FarmGreenOnContainer.copy(alpha = 0.8f)
                        )
                    }
                }
            }
        }

        // 4 Core Metric Cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    title = if (isHi) "कुल खर्च" else "Total Spend",
                    value = "₹${totalExpense.toInt()}",
                    subtitle = if (isHi) "🌾 खेती: ₹${farmExpense.toInt()}" else "🌾 Farm: ₹${farmExpense.toInt()}",
                    icon = Icons.Default.MonetizationOn,
                    color = FarmGreenPrimary,
                    modifier = Modifier.weight(1f).clickable { viewModel.setTab(GraminTab.EXPENSES) }
                )
                MetricCard(
                    title = if (isHi) "सक्रिय फसलें" else "Active Crops",
                    value = "${crops.size} Plots",
                    subtitle = "${crops.sumOf { it.areaValue }} Acre",
                    icon = Icons.Default.Spa,
                    color = StatusGreen,
                    modifier = Modifier.weight(1f).clickable { viewModel.setTab(GraminTab.PLANTATION) }
                )
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    title = if (isHi) "बाकी कार्य/याद" else "Pending Reminders",
                    value = "${pendingReminders.size}",
                    subtitle = if (isHi) "सिंचाई / खाद देय" else "Tasks Scheduled",
                    icon = Icons.Default.Alarm,
                    color = AmberSecondary,
                    modifier = Modifier.weight(1f).clickable { viewModel.setTab(GraminTab.REMINDERS) }
                )
                MetricCard(
                    title = if (isHi) "बही-खाता (उधार)" else "Ledger Balance",
                    value = "₹${(totalGiven - totalTaken).toInt()}",
                    subtitle = if (isHi) "लेना: ₹${totalGiven.toInt()}" else "Recv: ₹${totalGiven.toInt()}",
                    icon = Icons.Default.MenuBook,
                    color = StatusBlue,
                    modifier = Modifier.weight(1f).clickable { viewModel.setTab(GraminTab.TOOLS) }
                )
            }
        }

        // Weather & Farm Suitability Card
        item {
            val todayWeather = weatherList.firstOrNull()
            if (todayWeather != null) {
                Card(
                    modifier = Modifier.fillMaxWidth().testTag("weather_forecast_card"),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = CardDefaults.outlinedCardBorder()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.WbSunny,
                                    contentDescription = "Weather",
                                    tint = AmberSecondary,
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = if (isHi) "आज का मौसम व कृषि सलाह" else "Today's Farm Weather & Advice",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = FarmGreenContainer
                            ) {
                                Text(
                                    text = "${todayWeather.tempMax}°C / ${todayWeather.tempMin}°C",
                                    style = MaterialTheme.typography.labelMedium,
                                    color = FarmGreenOnContainer,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = todayWeather.farmAdvice,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.85f)
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = if (todayWeather.rainProb > 40) Color(0xFFFEE2E2) else Color(0xFFDCFCE7)
                            ) {
                                Text(
                                    text = "💧 Spray: ${todayWeather.sprayingAdvice}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = if (todayWeather.rainProb > 40) StatusRed else StatusGreen,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Color(0xFFEFF6FF)
                            ) {
                                Text(
                                    text = "🌧 Rain: ${todayWeather.rainProb}%",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = StatusBlue,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    }
                }
            }
        }

        // Quick Actions Row
        item {
            Text(
                text = if (isHi) "त्वरित कार्य (Quick Actions)" else "Quick Actions",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                QuickActionButton(
                    label = if (isHi) "+ खर्च" else "+ Expense",
                    icon = Icons.Default.MonetizationOn,
                    color = FarmGreenPrimary,
                    modifier = Modifier.weight(1f).testTag("quick_add_expense")
                ) {
                    viewModel.openDialog(ActiveDialog.AddExpense)
                }
                QuickActionButton(
                    label = if (isHi) "+ फसल" else "+ Crop",
                    icon = Icons.Default.Spa,
                    color = StatusGreen,
                    modifier = Modifier.weight(1f).testTag("quick_add_crop")
                ) {
                    viewModel.openDialog(ActiveDialog.AddCrop)
                }
                QuickActionButton(
                    label = if (isHi) "+ याद" else "+ Reminder",
                    icon = Icons.Default.Alarm,
                    color = AmberSecondary,
                    modifier = Modifier.weight(1f).testTag("quick_add_reminder")
                ) {
                    viewModel.openDialog(ActiveDialog.AddReminder)
                }
                QuickActionButton(
                    label = if (isHi) "+ बही" else "+ Ledger",
                    icon = Icons.Default.MenuBook,
                    color = StatusBlue,
                    modifier = Modifier.weight(1f).testTag("quick_add_bahi")
                ) {
                    viewModel.openDialog(ActiveDialog.AddBahiKhata)
                }
            }
        }

        // Recent Farm Tasks
        item {
            Text(
                text = if (isHi) "निकटतम कृषि कार्य (Upcoming Tasks)" else "Upcoming Farm Tasks",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                pendingReminders.take(3).forEach { rem ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = CardDefaults.outlinedCardBorder()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            IconButton(onClick = { viewModel.toggleReminder(rem) }) {
                                Icon(
                                    imageVector = if (rem.completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                    contentDescription = "Toggle",
                                    tint = if (rem.completed) StatusGreen else Color.Gray
                                )
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = rem.title,
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "📅 ${rem.dueDate} ${rem.dueTime ?: ""}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                )
                            }
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun MetricCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .clip(CircleShape)
                        .background(color.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = color,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
        }
    }
}

@Composable
fun QuickActionButton(
    label: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        modifier = modifier.height(44.dp),
        shape = RoundedCornerShape(12.dp),
        color = color.copy(alpha = 0.1f),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
    }
}
