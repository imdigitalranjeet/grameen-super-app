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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Opacify
import androidx.compose.material.icons.filled.Science
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.data.model.Language
import com.example.data.model.PlantationCrop
import com.example.ui.ActiveDialog
import com.example.ui.GraminViewModel
import com.example.ui.theme.AmberSecondary
import com.example.ui.theme.FarmGreenContainer
import com.example.ui.theme.FarmGreenOnContainer
import com.example.ui.theme.FarmGreenPrimary
import com.example.ui.theme.StatusBlue
import com.example.ui.theme.StatusGreen
import com.example.ui.theme.StatusRed

@Composable
fun PlantationScreen(viewModel: GraminViewModel) {
    val language by viewModel.language.collectAsState()
    val isHi = language == Language.HI
    val crops by viewModel.crops.collectAsState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.openDialog(ActiveDialog.AddCrop) },
                containerColor = FarmGreenPrimary,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_add_crop")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Crop")
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

            // Header Banner
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = FarmGreenContainer)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (isHi) "फसल प्रबंधन व रकबा" else "Crops & Plantation Logs",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = FarmGreenOnContainer
                        )
                        Text(
                            text = if (isHi) "${crops.size} खेत दर्ज • खाद, स्प्रे व कटाई रिकॉर्ड" else "${crops.size} Plots Logged • Fertilizers & Harvest",
                            style = MaterialTheme.typography.bodyMedium,
                            color = FarmGreenOnContainer.copy(alpha = 0.8f)
                        )
                    }
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = FarmGreenPrimary
                    ) {
                        Text(
                            text = "${crops.sumOf { it.areaValue }} Acre",
                            style = MaterialTheme.typography.labelLarge,
                            color = Color.White,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            if (crops.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (isHi) "कोई फसल नहीं मिली। + बटन से नई फसल जोड़ें।" else "No crops found. Tap + to add.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(crops, key = { it.id }) { crop ->
                        CropCard(
                            crop = crop,
                            isHi = isHi,
                            onDelete = { viewModel.deleteCrop(crop.id) },
                            onAddFertilizer = {
                                viewModel.openDialog(ActiveDialog.AddFertilizer(crop.id, crop.cropName))
                            },
                            onAddSpray = {
                                viewModel.openDialog(ActiveDialog.AddSpray(crop.id, crop.cropName))
                            },
                            onAddHarvest = {
                                viewModel.openDialog(ActiveDialog.AddHarvest(crop.id, crop.cropName))
                            }
                        )
                    }
                    item { Spacer(modifier = Modifier.height(72.dp)) }
                }
            }
        }
    }
}

@Composable
fun CropCard(
    crop: PlantationCrop,
    isHi: Boolean,
    onDelete: () -> Unit,
    onAddFertilizer: () -> Unit,
    onAddSpray: () -> Unit,
    onAddHarvest: () -> Unit
) {
    var isExpanded by remember { mutableStateOf(false) }

    val totalFertCost = crop.fertilizerLogs.sumOf { it.cost }
    val totalSprayCost = crop.sprayLogs.sumOf { it.cost }
    val totalIrriCost = crop.irrigationLogs.sumOf { it.electricityOrDieselCost }
    val totalInputCost = totalFertCost + totalSprayCost + totalIrriCost
    val totalRevenue = crop.harvestRecords.sumOf { it.totalRevenue }
    val netProfit = totalRevenue - totalInputCost

    Card(
        modifier = Modifier.fillMaxWidth().testTag("crop_card_${crop.id}"),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            // Plot Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(FarmGreenPrimary.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Spa,
                            contentDescription = null,
                            tint = FarmGreenPrimary,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = crop.cropName,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${crop.plotName} • ${crop.areaValue} ${crop.areaUnit}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (crop.status == "harvested") Color(0xFFDCFCE7) else Color(0xFFEFF6FF)
                    ) {
                        Text(
                            text = crop.status.uppercase(),
                            style = MaterialTheme.typography.labelSmall,
                            color = if (crop.status == "harvested") StatusGreen else StatusBlue,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            fontWeight = FontWeight.Bold
                        )
                    }
                    IconButton(onClick = onDelete) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete",
                            tint = Color.Gray.copy(alpha = 0.5f),
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Details Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "🌱 ${crop.variety ?: "Local Variety"}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
                Text(
                    text = "🗓️ Sown: ${crop.plantingDate}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Profit & Loss Overview
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = MaterialTheme.colorScheme.surfaceVariant
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (isHi) "कुल इनपुट लागत" else "Input Costs",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        Text(
                            text = "₹${totalInputCost.toInt()}",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = StatusRed
                        )
                    }
                    Column {
                        Text(
                            text = if (isHi) "कुल उपज आमदनी" else "Harvest Revenue",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        Text(
                            text = "₹${totalRevenue.toInt()}",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = StatusGreen
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = if (isHi) "शुद्ध लाभ" else "Net P&L",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        Text(
                            text = (if (netProfit >= 0) "+₹" else "-₹") + "${Math.abs(netProfit).toInt()}",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (netProfit >= 0) StatusGreen else StatusRed
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Quick Actions to Add Logs
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                OutlinedButton(
                    onClick = onAddFertilizer,
                    modifier = Modifier.weight(1f).height(36.dp),
                    contentPadding = ButtonDefaults.TextButtonContentPadding
                ) {
                    Text("+ खाद", style = MaterialTheme.typography.labelSmall)
                }
                OutlinedButton(
                    onClick = onAddSpray,
                    modifier = Modifier.weight(1f).height(36.dp),
                    contentPadding = ButtonDefaults.TextButtonContentPadding
                ) {
                    Text("+ स्प्रे", style = MaterialTheme.typography.labelSmall)
                }
                OutlinedButton(
                    onClick = onAddHarvest,
                    modifier = Modifier.weight(1f).height(36.dp),
                    contentPadding = ButtonDefaults.TextButtonContentPadding
                ) {
                    Text("+ कटाई", style = MaterialTheme.typography.labelSmall)
                }
            }

            // Expand Logs Toggle
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { isExpanded = !isExpanded }
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isExpanded) (if (isHi) "विवरण छुपाएँ" else "Hide Logs") else (if (isHi) "खाद व स्प्रे रिकॉर्ड देखें (${crop.fertilizerLogs.size + crop.sprayLogs.size})" else "View Logs (${crop.fertilizerLogs.size + crop.sprayLogs.size})"),
                    style = MaterialTheme.typography.labelSmall,
                    color = FarmGreenPrimary,
                    fontWeight = FontWeight.SemiBold
                )
                Icon(
                    imageVector = if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = null,
                    tint = FarmGreenPrimary,
                    modifier = Modifier.size(18.dp)
                )
            }

            if (isExpanded) {
                Spacer(modifier = Modifier.height(8.dp))
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    // Fertilizer Logs
                    if (crop.fertilizerLogs.isNotEmpty()) {
                        Text(
                            text = if (isHi) "🌾 खाद प्रयोग (Fertilizer Logs):" else "🌾 Fertilizer Logs:",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold
                        )
                        crop.fertilizerLogs.forEach { f ->
                            Text(
                                text = "• ${f.date}: ${f.fertilizerType} (${f.quantity} ${f.unit}) - ₹${f.cost.toInt()} [${f.stage}]",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                            )
                        }
                    }

                    // Spray Logs
                    if (crop.sprayLogs.isNotEmpty()) {
                        Text(
                            text = if (isHi) "💧 स्प्रे / कीटनाशक (Spray Logs):" else "💧 Spray Logs:",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold
                        )
                        crop.sprayLogs.forEach { s ->
                            Text(
                                text = "• ${s.date}: ${s.name} - ₹${s.cost.toInt()} (${s.purpose})",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                            )
                        }
                    }

                    // Harvest Records
                    if (crop.harvestRecords.isNotEmpty()) {
                        Text(
                            text = if (isHi) "📦 कटाई व बिक्री (Harvest Records):" else "📦 Harvest Records:",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = StatusGreen
                        )
                        crop.harvestRecords.forEach { h ->
                            Text(
                                text = "• ${h.date}: ${h.yieldAmount} ${h.unit} @ ₹${h.sellingRatePerUnit}/Q = ₹${h.totalRevenue.toInt()} (${h.buyerOrMandi})",
                                style = MaterialTheme.typography.bodySmall,
                                color = StatusGreen,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }
        }
    }
}
