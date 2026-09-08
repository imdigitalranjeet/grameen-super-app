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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Calculate
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.ShowChart
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import androidx.compose.ui.unit.sp
import com.example.data.model.Language
import com.example.data.model.MandiPrice
import com.example.ui.ChatMessage
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
fun ToolsScreen(viewModel: GraminViewModel) {
    val language by viewModel.language.collectAsState()
    val isHi = language == Language.HI

    var selectedToolTabIndex by remember { mutableIntStateOf(0) }
    val tabTitles = if (isHi) {
        listOf("खाद कैलकुलेटर", "मंडी भाव", "किसान AI", "हेल्पलाइन")
    } else {
        listOf("Fertilizer Calc", "Mandi Rates", "Kisan AI", "Helplines")
    }

    Column(modifier = Modifier.fillMaxSize()) {
        ScrollableTabRow(
            selectedTabIndex = selectedToolTabIndex,
            modifier = Modifier.fillMaxWidth(),
            edgePadding = 16.dp
        ) {
            tabTitles.forEachIndexed { index, title ->
                Tab(
                    selected = selectedToolTabIndex == index,
                    onClick = { selectedToolTabIndex = index },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (selectedToolTabIndex == index) FontWeight.Bold else FontWeight.Normal
                        )
                    }
                )
            }
        }

        when (selectedToolTabIndex) {
            0 -> FertilizerCalculatorTool(viewModel = viewModel, isHi = isHi)
            1 -> MandiRatesTool(viewModel = viewModel, isHi = isHi)
            2 -> KisanAIChatTool(viewModel = viewModel, isHi = isHi)
            3 -> KisanHelplinesTool(isHi = isHi)
        }
    }
}

@Composable
fun FertilizerCalculatorTool(viewModel: GraminViewModel, isHi: Boolean) {
    val crop by viewModel.calcCrop.collectAsState()
    val area by viewModel.calcArea.collectAsState()
    val unit by viewModel.calcUnit.collectAsState()
    val result by viewModel.calcResult.collectAsState()

    val cropOptions = listOf(
        "Wheat (गेहूं)",
        "Mustard (सरसों)",
        "Paddy (धान)",
        "Potato (आलू)"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = FarmGreenContainer)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = if (isHi) "🌾 वैज्ञानिक संतुलित खाद कैलकुलेटर" else "🌾 Scientific Crop Nutrition Calculator",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = FarmGreenOnContainer
                    )
                    Text(
                        text = if (isHi) "रकबे के अनुसार यूरिया, DAP, पोटाश व जिंक की सटीक मात्रा" else "Accurate Urea, DAP, Potash & Zinc dosing per acre/bigha",
                        style = MaterialTheme.typography.bodySmall,
                        color = FarmGreenOnContainer.copy(alpha = 0.8f)
                    )
                }
            }
        }

        // Crop Selection Chips
        item {
            Text(
                text = if (isHi) "फसल चुनें (Select Crop):" else "Select Crop:",
                style = MaterialTheme.typography.labelLarge,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(6.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(cropOptions) { opt ->
                    FilterChip(
                        selected = crop == opt,
                        onClick = { viewModel.updateCalcParams(opt, area, unit) },
                        label = { Text(opt) },
                        modifier = Modifier.testTag("fert_crop_$opt")
                    )
                }
            }
        }

        // Area & Unit Input
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = area,
                    onValueChange = { viewModel.updateCalcParams(crop, it, unit) },
                    label = { Text(if (isHi) "रकबा (Area)" else "Area") },
                    modifier = Modifier.weight(1f).testTag("fert_area_input"),
                    singleLine = true
                )
                FilterChip(
                    selected = unit == "Acre",
                    onClick = { viewModel.updateCalcParams(crop, area, "Acre") },
                    label = { Text("Acre") }
                )
                FilterChip(
                    selected = unit == "Bigha",
                    onClick = { viewModel.updateCalcParams(crop, area, "Bigha") },
                    label = { Text("Bigha") }
                )
            }
        }

        // Calculation Results
        if (result != null) {
            item {
                Text(
                    text = if (isHi) "अनुशंसित खाद मात्रा (Recommended Dose):" else "Recommended Fertilizer Requirement:",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    DosageBadge(
                        title = "Urea",
                        value = "${result?.ureaBags} बोरी",
                        color = FarmGreenPrimary,
                        modifier = Modifier.weight(1f)
                    )
                    DosageBadge(
                        title = "DAP",
                        value = "${result?.dapBags} बोरी",
                        color = AmberSecondary,
                        modifier = Modifier.weight(1f)
                    )
                    DosageBadge(
                        title = "Potash",
                        value = "${result?.potashBags} बोरी",
                        color = StatusBlue,
                        modifier = Modifier.weight(1f)
                    )
                    DosageBadge(
                        title = "Zinc",
                        value = "${result?.zincKg} kg",
                        color = Color(0xFF7C3AED),
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // Application Schedule
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = CardDefaults.outlinedCardBorder()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = if (isHi) "📋 खाद देने का चरणबद्ध समय (Schedule):" else "📋 Application Time & Splits:",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        result?.schedule?.forEach { step ->
                            Text(
                                text = "• $step",
                                style = MaterialTheme.typography.bodyMedium,
                                modifier = Modifier.padding(vertical = 3.dp),
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.85f)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DosageBadge(
    title: String,
    value: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(10.dp),
        color = color.copy(alpha = 0.12f),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Column(
            modifier = Modifier.padding(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall,
                color = color,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
    }
}

@Composable
fun MandiRatesTool(viewModel: GraminViewModel, isHi: Boolean) {
    val mandiList = viewModel.mandiPrices

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = FarmGreenContainer)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = if (isHi) "📊 कृषि उपज मंडी लाइव भाव" else "📊 Live APMC Mandi Rates",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = FarmGreenOnContainer
                    )
                    Text(
                        text = if (isHi) "प्रमुख मंडियों के दैनिक मॉडल भाव व सरकारी MSP दर" else "Daily market modal prices with Government MSP comparison",
                        style = MaterialTheme.typography.bodySmall,
                        color = FarmGreenOnContainer.copy(alpha = 0.8f)
                    )
                }
            }
        }

        items(mandiList, key = { it.id }) { mandi ->
            MandiCard(mandi = mandi, isHi = isHi)
        }
    }
}

@Composable
fun MandiCard(mandi: MandiPrice, isHi: Boolean) {
    val isAboveMsp = mandi.modalPrice >= mandi.mspRate
    val trendIcon = when (mandi.trend) {
        "up" -> Icons.Default.TrendingUp
        "down" -> Icons.Default.TrendingDown
        else -> Icons.Default.ShowChart
    }
    val trendColor = when (mandi.trend) {
        "up" -> StatusGreen
        "down" -> StatusRed
        else -> AmberSecondary
    }

    Card(
        modifier = Modifier.fillMaxWidth().testTag("mandi_card_${mandi.id}"),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(trendColor.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = trendIcon,
                    contentDescription = null,
                    tint = trendColor,
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
                        text = if (isHi) mandi.cropHindi else mandi.crop,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "₹${mandi.modalPrice.toInt()}/Q",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = FarmGreenPrimary
                    )
                }

                Spacer(modifier = Modifier.height(2.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "📍 ${mandi.marketName}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                    Text(
                        text = "MSP: ₹${mandi.mspRate.toInt()}/Q",
                        style = MaterialTheme.typography.labelSmall,
                        color = if (isAboveMsp) StatusGreen else StatusAmber,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}

@Composable
fun KisanAIChatTool(viewModel: GraminViewModel, isHi: Boolean) {
    val messages by viewModel.chatMessages.collectAsState()
    val isThinking by viewModel.isAiThinking.collectAsState()
    var inputQuery by remember { mutableStateOf("") }

    val quickQuestions = if (isHi) listOf(
        "गेहूं में पहली सिंचाई कब करें?",
        "पीला रतुआ रोग की रोकथाम",
        "KCC लोन पर ब्याज छूट कैसे मिलती है?",
        "सरसों में सल्फर खाद का क्या फायदा है?"
    ) else listOf(
        "When is the 1st irrigation for wheat?",
        "How to treat yellow rust in crops?",
        "What is KCC loan interest subvention?",
        "Why is sulphur important for mustard?"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Quick Chips
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(quickQuestions) { q ->
                Surface(
                    onClick = { viewModel.askKisanAI(q) },
                    shape = RoundedCornerShape(20.dp),
                    color = FarmGreenContainer,
                    border = CardDefaults.outlinedCardBorder()
                ) {
                    Text(
                        text = q,
                        style = MaterialTheme.typography.labelSmall,
                        color = FarmGreenOnContainer,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Messages List
        LazyColumn(
            modifier = Modifier.weight(1f).fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages) { msg ->
                ChatBubble(msg = msg)
            }
            if (isThinking) {
                item {
                    Row(
                        modifier = Modifier.padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isHi) "सलाहकार सोच रहा है..." else "Gramin AI is thinking...",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.Gray
                        )
                    }
                }
            }
        }

        // Input Field
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = inputQuery,
                onValueChange = { inputQuery = it },
                placeholder = { Text(if (isHi) "फसल, खाद या रोग संबंधी सवाल पूछें..." else "Ask crop or fertilizer question...") },
                modifier = Modifier.weight(1f).testTag("kisan_chat_input"),
                singleLine = true
            )
            IconButton(
                onClick = {
                    if (inputQuery.isNotBlank()) {
                        viewModel.askKisanAI(inputQuery.trim())
                        inputQuery = ""
                    }
                },
                modifier = Modifier.testTag("kisan_chat_send")
            ) {
                Icon(
                    imageVector = Icons.Default.Send,
                    contentDescription = "Send",
                    tint = FarmGreenPrimary
                )
            }
        }
    }
}

@Composable
fun ChatBubble(msg: ChatMessage) {
    val isUser = msg.isUser
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
    ) {
        Surface(
            shape = RoundedCornerShape(
                topStart = 14.dp,
                topEnd = 14.dp,
                bottomStart = if (isUser) 14.dp else 2.dp,
                bottomEnd = if (isUser) 2.dp else 14.dp
            ),
            color = if (isUser) FarmGreenPrimary else FarmGreenContainer,
            modifier = Modifier.fillMaxWidth(0.85f)
        ) {
            Text(
                text = msg.text,
                style = MaterialTheme.typography.bodyMedium,
                color = if (isUser) Color.White else FarmGreenOnContainer,
                modifier = Modifier.padding(12.dp)
            )
        }
    }
}

@Composable
fun KisanHelplinesTool(isHi: Boolean) {
    val helplines = listOf(
        Pair("Kisan Call Center (किसान कॉल सेंटर)", "1800-180-1551 (Toll-Free, 22 Languages)"),
        Pair("PM-Kisan Samman Nidhi (पीएम किसान)", "155261 / 011-24300606"),
        Pair("Pradhan Mantri Fasal Bima Yojana", "1800-889-6868 (Crop Insurance Claim)"),
        Pair("National Weather & Agromet IMD", "1800-180-1717 (Mausam Seva)")
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = FarmGreenContainer)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = if (isHi) "📞 महत्वपूर्ण सरकारी किसान हेल्पलाइन" else "📞 Official Agricultural Helplines",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = FarmGreenOnContainer
                    )
                    Text(
                        text = if (isHi) "कृषि वैज्ञानिक सलाह व सरकारी अनुदान योजनाओं हेतु सीधे संपर्क करें" else "Free national numbers for live scientist advice & insurance assistance",
                        style = MaterialTheme.typography.bodySmall,
                        color = FarmGreenOnContainer.copy(alpha = 0.8f)
                    )
                }
            }
        }

        items(helplines) { (name, phone) ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(FarmGreenPrimary.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Phone,
                            contentDescription = null,
                            tint = FarmGreenPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = name,
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = phone,
                            style = MaterialTheme.typography.bodyMedium,
                            color = FarmGreenPrimary,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }
    }
}
