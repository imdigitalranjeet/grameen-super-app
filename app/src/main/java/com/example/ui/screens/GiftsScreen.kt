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
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.data.model.GiftItem
import com.example.data.model.Language
import com.example.ui.ActiveDialog
import com.example.ui.GraminViewModel
import com.example.ui.theme.AmberSecondary
import com.example.ui.theme.FarmGreenContainer
import com.example.ui.theme.FarmGreenOnContainer
import com.example.ui.theme.FarmGreenPrimary
import com.example.ui.theme.StatusBlue
import com.example.ui.theme.StatusGreen

@Composable
fun GiftsScreen(viewModel: GraminViewModel) {
    val language by viewModel.language.collectAsState()
    val isHi = language == Language.HI

    val gifts by viewModel.gifts.collectAsState()
    val filter by viewModel.giftFilter.collectAsState()

    val filteredList = gifts.filter {
        when (filter) {
            "given" -> it.type == "given"
            "received" -> it.type == "received"
            else -> true
        }
    }

    val totalGiven = gifts.filter { it.type == "given" }.sumOf { it.amountOrValue }
    val totalReceived = gifts.filter { it.type == "received" }.sumOf { it.amountOrValue }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.openDialog(ActiveDialog.AddGift) },
                containerColor = AmberSecondary,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_add_gift")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Gift")
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
                    onClick = { viewModel.setGiftFilter("all") },
                    label = { Text(if (isHi) "सभी शगुन (${gifts.size})" else "All (${gifts.size})") },
                    modifier = Modifier.testTag("filter_all_gifts")
                )
                FilterChip(
                    selected = filter == "given",
                    onClick = { viewModel.setGiftFilter("given") },
                    label = { Text(if (isHi) "📤 दिया गया शगुन" else "📤 Given") },
                    modifier = Modifier.testTag("filter_given_gifts")
                )
                FilterChip(
                    selected = filter == "received",
                    onClick = { viewModel.setGiftFilter("received") },
                    label = { Text(if (isHi) "📥 मिला हुआ शगुन" else "📥 Received") },
                    modifier = Modifier.testTag("filter_received_gifts")
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Total Balance Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = FarmGreenContainer)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (isHi) "न्योता / शगुन बही (Gift Registry)" else "Village Gift & Shagun Ledger",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = FarmGreenOnContainer
                        )
                        Text(
                            text = if (isHi) "शादी-ब्याह, मुंडन व न्योता लेन-देन हिसाब" else "Weddings, housewarmings and return gift tracking",
                            style = MaterialTheme.typography.bodySmall,
                            color = FarmGreenOnContainer.copy(alpha = 0.8f)
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "📤 दिया: ₹${totalGiven.toInt()}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = AmberSecondary
                        )
                        Text(
                            text = "📥 मिला: ₹${totalReceived.toInt()}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = StatusGreen
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            if (filteredList.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (isHi) "कोई शगुन प्रविष्टि नहीं मिली। + बटन से जोड़ें।" else "No gifts found. Tap + to record.",
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
                        GiftCard(
                            item = item,
                            isHi = isHi,
                            onToggleSettled = { viewModel.toggleGiftSettled(item) },
                            onDelete = { viewModel.deleteGift(item.id) }
                        )
                    }
                    item { Spacer(modifier = Modifier.height(72.dp)) }
                }
            }
        }
    }
}

@Composable
fun GiftCard(
    item: GiftItem,
    isHi: Boolean,
    onToggleSettled: () -> Unit,
    onDelete: () -> Unit
) {
    val isGiven = item.type == "given"
    val badgeColor = if (isGiven) AmberSecondary else StatusGreen

    Card(
        modifier = Modifier.fillMaxWidth().testTag("gift_card_${item.id}"),
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
                    .background(badgeColor.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.CardGiftcard,
                    contentDescription = null,
                    tint = badgeColor,
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
                        text = item.personName,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "₹${item.amountOrValue.toInt()}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = badgeColor
                    )
                }

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = "${item.occasion} • ${item.villageOrRelation}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )

                Spacer(modifier = Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = if (isGiven) Color(0xFFFEF3C7) else Color(0xFFDCFCE7)
                    ) {
                        Text(
                            text = if (isGiven) "📤 दिया (Given)" else "📥 मिला (Received)",
                            style = MaterialTheme.typography.labelSmall,
                            color = badgeColor,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Surface(
                        onClick = onToggleSettled,
                        shape = RoundedCornerShape(6.dp),
                        color = if (item.counterGiftSettled) Color(0xFFDCFCE7) else Color(0xFFF3F4F6)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = if (item.counterGiftSettled) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                contentDescription = null,
                                tint = if (item.counterGiftSettled) StatusGreen else Color.Gray,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (item.counterGiftSettled) "वापसी चुकता" else "वापसी बाकी",
                                style = MaterialTheme.typography.labelSmall,
                                color = if (item.counterGiftSettled) StatusGreen else Color.Gray
                            )
                        }
                    }

                    Text(
                        text = item.date,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                    )
                }
            }

            IconButton(onClick = onDelete) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Delete",
                    tint = Color.Gray.copy(alpha = 0.5f),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
