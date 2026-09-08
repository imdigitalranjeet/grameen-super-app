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
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.example.data.model.BahiKhataItem
import com.example.data.model.Language
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
fun BahiKhataScreen(viewModel: GraminViewModel) {
    val language by viewModel.language.collectAsState()
    val isHi = language == Language.HI

    val list by viewModel.bahiKhata.collectAsState()
    val filter by viewModel.bahiFilter.collectAsState()

    val filteredList = list.filter {
        when (filter) {
            "you_gave" -> it.type == "you_gave"
            "you_took" -> it.type == "you_took"
            "pending" -> !it.settled
            else -> true
        }
    }

    val totalGivenPending = list.filter { it.type == "you_gave" && !it.settled }.sumOf { it.amount }
    val totalTookPending = list.filter { it.type == "you_took" && !it.settled }.sumOf { it.amount }
    val netReceivable = totalGivenPending - totalTookPending

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.openDialog(ActiveDialog.AddBahiKhata) },
                containerColor = StatusBlue,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_add_bahi")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Bahi Entry")
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
                    onClick = { viewModel.setBahiFilter("all") },
                    label = { Text(if (isHi) "सभी खाते (${list.size})" else "All (${list.size})") },
                    modifier = Modifier.testTag("filter_all_bahi")
                )
                FilterChip(
                    selected = filter == "you_gave",
                    onClick = { viewModel.setBahiFilter("you_gave") },
                    label = { Text(if (isHi) "📤 आपने दिया" else "📤 You Gave") },
                    modifier = Modifier.testTag("filter_gave_bahi")
                )
                FilterChip(
                    selected = filter == "you_took",
                    onClick = { viewModel.setBahiFilter("you_took") },
                    label = { Text(if (isHi) "📥 आपने लिया" else "📥 You Took") },
                    modifier = Modifier.testTag("filter_took_bahi")
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Balance Summary Card
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
                            text = if (isHi) "बही-खाता / उधार-जमा लेजर" else "Village Bahi Khata (Credit/Debit)",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = FarmGreenOnContainer
                        )
                        Text(
                            text = if (isHi) "दुकानदार, बटाईदार व पड़ोसियों का हिसाब" else "Store credit, diesel ledger & neighbor accounts",
                            style = MaterialTheme.typography.bodySmall,
                            color = FarmGreenOnContainer.copy(alpha = 0.8f)
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "लेना (Gave): ₹${totalGivenPending.toInt()}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = StatusGreen
                        )
                        Text(
                            text = "देना (Took): ₹${totalTookPending.toInt()}",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = StatusRed
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
                        text = if (isHi) "कोई बही-खाता प्रविष्टि नहीं मिली। + दबाकर जोड़ें।" else "No ledger entries found. Tap + to add.",
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
                        BahiCard(
                            item = item,
                            isHi = isHi,
                            onToggleSettled = { viewModel.toggleBahiSettled(item) },
                            onDelete = { viewModel.deleteBahiKhata(item.id) }
                        )
                    }
                    item { Spacer(modifier = Modifier.height(72.dp)) }
                }
            }
        }
    }
}

@Composable
fun BahiCard(
    item: BahiKhataItem,
    isHi: Boolean,
    onToggleSettled: () -> Unit,
    onDelete: () -> Unit
) {
    val isGave = item.type == "you_gave"
    val color = if (isGave) StatusGreen else StatusRed

    Card(
        modifier = Modifier.fillMaxWidth().testTag("bahi_card_${item.id}"),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (item.settled) MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f) else MaterialTheme.colorScheme.surface
        ),
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
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (isGave) Icons.Default.ArrowUpward else Icons.Default.ArrowDownward,
                    contentDescription = null,
                    tint = color,
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
                        fontWeight = FontWeight.SemiBold,
                        textDecoration = if (item.settled) TextDecoration.LineThrough else TextDecoration.None
                    )
                    Text(
                        text = "₹${item.amount.toInt()}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = color
                    )
                }

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = "${item.purpose} ${if (item.phone != null) "• 📞 " + item.phone else ""}",
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
                        color = if (isGave) Color(0xFFDCFCE7) else Color(0xFFFEE2E2)
                    ) {
                        Text(
                            text = if (isGave) "📤 आपने दिया (You Gave)" else "📥 आपने लिया (You Took)",
                            style = MaterialTheme.typography.labelSmall,
                            color = color,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Surface(
                        onClick = onToggleSettled,
                        shape = RoundedCornerShape(6.dp),
                        color = if (item.settled) Color(0xFFDCFCE7) else Color(0xFFF3F4F6)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = if (item.settled) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                contentDescription = null,
                                tint = if (item.settled) StatusGreen else Color.Gray,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = if (item.settled) "चुकता (Settled)" else "बाकी (Pending)",
                                style = MaterialTheme.typography.labelSmall,
                                color = if (item.settled) StatusGreen else Color.Gray
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
