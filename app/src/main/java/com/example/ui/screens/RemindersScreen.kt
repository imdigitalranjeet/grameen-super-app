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
import androidx.compose.material.icons.filled.Alarm
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
import com.example.data.model.Language
import com.example.data.model.ReminderItem
import com.example.ui.ActiveDialog
import com.example.ui.GraminViewModel
import com.example.ui.theme.AmberSecondary
import com.example.ui.theme.FarmGreenContainer
import com.example.ui.theme.FarmGreenOnContainer
import com.example.ui.theme.FarmGreenPrimary
import com.example.ui.theme.StatusAmber
import com.example.ui.theme.StatusGreen
import com.example.ui.theme.StatusRed

@Composable
fun RemindersScreen(viewModel: GraminViewModel) {
    val language by viewModel.language.collectAsState()
    val isHi = language == Language.HI

    val reminders by viewModel.reminders.collectAsState()
    val filter by viewModel.reminderFilter.collectAsState()

    val filteredList = reminders.filter {
        when (filter) {
            "pending" -> !it.completed
            "completed" -> it.completed
            else -> true
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.openDialog(ActiveDialog.AddReminder) },
                containerColor = AmberSecondary,
                contentColor = Color.White,
                modifier = Modifier.testTag("fab_add_reminder")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Reminder")
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
                    onClick = { viewModel.setReminderFilter("all") },
                    label = { Text(if (isHi) "सभी कार्य (${reminders.size})" else "All (${reminders.size})") },
                    modifier = Modifier.testTag("filter_all_reminders")
                )
                FilterChip(
                    selected = filter == "pending",
                    onClick = { viewModel.setReminderFilter("pending") },
                    label = { Text(if (isHi) "⏳ बाकी (${reminders.count { !it.completed }})" else "Pending (${reminders.count { !it.completed }})") },
                    modifier = Modifier.testTag("filter_pending_reminders")
                )
                FilterChip(
                    selected = filter == "completed",
                    onClick = { viewModel.setReminderFilter("completed") },
                    label = { Text(if (isHi) "✅ पूर्ण (${reminders.count { it.completed }})" else "Done (${reminders.count { it.completed }})") },
                    modifier = Modifier.testTag("filter_done_reminders")
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Banner
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
                            text = if (isHi) "स्मार्ट कृषि व ग्रामीण याद (Reminders)" else "Smart Farm & Village Reminders",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = FarmGreenOnContainer
                        )
                        Text(
                            text = if (isHi) "सिंचाई तारीख, खाद बुकिंग, KCC ब्याज व सरकारी तिथि" else "Irrigation schedule, PACs fertilizer & KCC dates",
                            style = MaterialTheme.typography.bodySmall,
                            color = FarmGreenOnContainer.copy(alpha = 0.8f)
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
                        text = if (isHi) "कोई रिमाइंडर नहीं है।" else "No reminders found.",
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
                        ReminderCard(
                            item = item,
                            isHi = isHi,
                            onToggle = { viewModel.toggleReminder(item) },
                            onDelete = { viewModel.deleteReminder(item.id) }
                        )
                    }
                    item { Spacer(modifier = Modifier.height(72.dp)) }
                }
            }
        }
    }
}

@Composable
fun ReminderCard(
    item: ReminderItem,
    isHi: Boolean,
    onToggle: () -> Unit,
    onDelete: () -> Unit
) {
    val priorityColor = when (item.priority.lowercase()) {
        "high" -> StatusRed
        "medium" -> AmberSecondary
        else -> StatusGreen
    }

    Card(
        modifier = Modifier.fillMaxWidth().testTag("reminder_card_${item.id}"),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (item.completed) MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f) else MaterialTheme.colorScheme.surface
        ),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onToggle) {
                Icon(
                    imageVector = if (item.completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                    contentDescription = "Toggle",
                    tint = if (item.completed) StatusGreen else Color.Gray,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    textDecoration = if (item.completed) TextDecoration.LineThrough else TextDecoration.None,
                    color = if (item.completed) Color.Gray else MaterialTheme.colorScheme.onSurface
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = priorityColor.copy(alpha = 0.15f)
                    ) {
                        Text(
                            text = "${item.priority.uppercase()}",
                            style = MaterialTheme.typography.labelSmall,
                            color = priorityColor,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Text(
                        text = "📅 ${item.dueDate} ${item.dueTime ?: ""}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }

                if (!item.notes.isNullOrBlank()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = item.notes,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
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
