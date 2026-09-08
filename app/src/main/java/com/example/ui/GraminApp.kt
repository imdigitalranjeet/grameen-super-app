package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Alarm
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MonetizationOn
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
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
import com.example.data.model.Language
import com.example.ui.screens.BahiKhataScreen
import com.example.ui.screens.ExpensesScreen
import com.example.ui.screens.GiftsScreen
import com.example.ui.screens.GraminDialogHost
import com.example.ui.screens.OverviewScreen
import com.example.ui.screens.PlantationScreen
import com.example.ui.screens.RemindersScreen
import com.example.ui.screens.ToolsScreen
import com.example.ui.theme.FarmGreenContainer
import com.example.ui.theme.FarmGreenOnContainer
import com.example.ui.theme.FarmGreenPrimary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GraminApp(viewModel: GraminViewModel) {
    val language by viewModel.language.collectAsState()
    val isHi = language == Language.HI

    val currentTab by viewModel.currentTab.collectAsState()
    val activeDialog by viewModel.activeDialog.collectAsState()

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = if (isHi) "ग्रामी (Gramin)" else "Gramin Super App",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                },
                actions = {
                    Surface(
                        onClick = { viewModel.toggleLanguage() },
                        shape = CircleShape,
                        color = Color.White.copy(alpha = 0.2f),
                        modifier = Modifier.padding(end = 12.dp).testTag("language_toggle_btn")
                    ) {
                        Text(
                            text = if (isHi) "🇮🇳 EN" else "🇮🇳 हिंदी",
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = FarmGreenPrimary
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = currentTab == GraminTab.OVERVIEW,
                    onClick = { viewModel.setTab(GraminTab.OVERVIEW) },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text(if (isHi) "होम" else "Home") },
                    modifier = Modifier.testTag("nav_tab_overview"),
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FarmGreenPrimary,
                        selectedTextColor = FarmGreenPrimary,
                        indicatorColor = FarmGreenContainer
                    )
                )

                NavigationBarItem(
                    selected = currentTab == GraminTab.EXPENSES,
                    onClick = { viewModel.setTab(GraminTab.EXPENSES) },
                    icon = { Icon(Icons.Default.MonetizationOn, contentDescription = "Expenses") },
                    label = { Text(if (isHi) "खर्च" else "Spend") },
                    modifier = Modifier.testTag("nav_tab_expenses"),
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FarmGreenPrimary,
                        selectedTextColor = FarmGreenPrimary,
                        indicatorColor = FarmGreenContainer
                    )
                )

                NavigationBarItem(
                    selected = currentTab == GraminTab.PLANTATION,
                    onClick = { viewModel.setTab(GraminTab.PLANTATION) },
                    icon = { Icon(Icons.Default.Spa, contentDescription = "Plantation") },
                    label = { Text(if (isHi) "फसल" else "Crops") },
                    modifier = Modifier.testTag("nav_tab_plantation"),
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FarmGreenPrimary,
                        selectedTextColor = FarmGreenPrimary,
                        indicatorColor = FarmGreenContainer
                    )
                )

                NavigationBarItem(
                    selected = currentTab == GraminTab.REMINDERS,
                    onClick = { viewModel.setTab(GraminTab.REMINDERS) },
                    icon = { Icon(Icons.Default.Alarm, contentDescription = "Reminders") },
                    label = { Text(if (isHi) "याद" else "Tasks") },
                    modifier = Modifier.testTag("nav_tab_reminders"),
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FarmGreenPrimary,
                        selectedTextColor = FarmGreenPrimary,
                        indicatorColor = FarmGreenContainer
                    )
                )

                NavigationBarItem(
                    selected = currentTab == GraminTab.GIFTS,
                    onClick = { viewModel.setTab(GraminTab.GIFTS) },
                    icon = { Icon(Icons.Default.CardGiftcard, contentDescription = "Shagun") },
                    label = { Text(if (isHi) "शगुन" else "Shagun") },
                    modifier = Modifier.testTag("nav_tab_gifts"),
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FarmGreenPrimary,
                        selectedTextColor = FarmGreenPrimary,
                        indicatorColor = FarmGreenContainer
                    )
                )

                NavigationBarItem(
                    selected = currentTab == GraminTab.TOOLS,
                    onClick = { viewModel.setTab(GraminTab.TOOLS) },
                    icon = { Icon(Icons.Default.Build, contentDescription = "Tools") },
                    label = { Text(if (isHi) "उपकरण" else "Tools") },
                    modifier = Modifier.testTag("nav_tab_tools"),
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = FarmGreenPrimary,
                        selectedTextColor = FarmGreenPrimary,
                        indicatorColor = FarmGreenContainer
                    )
                )
            }
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when (currentTab) {
                GraminTab.OVERVIEW -> OverviewScreen(viewModel = viewModel)
                GraminTab.EXPENSES -> ExpensesScreen(viewModel = viewModel)
                GraminTab.PLANTATION -> PlantationScreen(viewModel = viewModel)
                GraminTab.REMINDERS -> RemindersScreen(viewModel = viewModel)
                GraminTab.GIFTS -> GiftsScreen(viewModel = viewModel)
                GraminTab.TOOLS -> ToolsScreen(viewModel = viewModel)
            }
        }
    }

    // Host for all Add/Edit dialogs
    GraminDialogHost(
        viewModel = viewModel,
        activeDialog = activeDialog,
        language = language
    )
}
