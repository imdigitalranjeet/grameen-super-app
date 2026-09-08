package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = FarmGreenPrimary,
    onPrimary = FarmGreenOnPrimary,
    primaryContainer = FarmGreenContainer,
    onPrimaryContainer = FarmGreenOnContainer,
    secondary = AmberSecondary,
    onSecondary = AmberOnSecondary,
    secondaryContainer = AmberSecondaryContainer,
    onSecondaryContainer = AmberOnSecondaryContainer,
    tertiary = EarthTertiary,
    onTertiary = FarmGreenOnPrimary,
    tertiaryContainer = EarthTertiaryContainer,
    background = FarmBackground,
    onBackground = FarmGreenOnContainer,
    surface = FarmSurface,
    onSurface = FarmGreenOnContainer,
    surfaceVariant = FarmSurfaceVariant,
    outline = FarmOutline
)

@Composable
fun GraminTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}
