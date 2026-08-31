import { ThemeTokens } from '../theme.config'

export function buildCSSVars(tokens: ThemeTokens): string {
  const { colors, typography, spacing, shape, shadows } = tokens
  return [
    `--color-primary: ${colors.primary}`,
    `--color-primary-hover: ${colors.primaryHover}`,
    `--color-primary-fg: ${colors.primaryFg}`,
    `--color-primary-on-inverse: ${colors.primaryOnInverse}`,
    `--color-background: ${colors.background}`,
    `--color-surface: ${colors.surface}`,
    `--color-surface-hover: ${colors.surfaceHover}`,
    `--color-text-primary: ${colors.textPrimary}`,
    `--color-text-secondary: ${colors.textSecondary}`,
    `--color-text-muted: ${colors.textMuted}`,
    `--color-border: ${colors.border}`,
    `--color-border-hover: ${colors.borderHover}`,
    `--color-surface-inverse: ${colors.surfaceInverse}`,
    `--color-text-on-inverse: ${colors.textOnInverse}`,
    `--font-body: ${typography.fontBody}`,
    `--font-heading: ${typography.fontHeading}`,
    `--section-padding-y: ${spacing.sectionPaddingY}`,
    `--container-max-width: ${spacing.containerMaxWidth}`,
    `--container-padding-x: ${spacing.containerPaddingX}`,
    `--radius-sm: ${shape.radiusSm}`,
    `--radius-md: ${shape.radiusMd}`,
    `--radius-lg: ${shape.radiusLg}`,
    `--radius-xl: ${shape.radiusXl}`,
    `--radius-full: ${shape.radiusFull}`,
    `--shadow-sm: ${shadows.shadowSm}`,
    `--shadow-md: ${shadows.shadowMd}`,
    `--shadow-lg: ${shadows.shadowLg}`,
  ].join('; ')
}
