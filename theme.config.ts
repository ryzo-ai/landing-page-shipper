export type DesignStyle = 'flat' | 'gradient' | 'skeuomorphic'
export type ThemeMode = 'light' | 'dark'

export interface ThemeTokens {
  colors: {
    primary: string
    primaryHover: string
    primaryFg: string
    primaryOnInverse: string
    gradientAccent: string
    background: string
    surface: string
    surfaceHover: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    border: string
    borderHover: string
    surfaceInverse: string
    textOnInverse: string
    /** Brand secondary (glopros.ai step badges, secondary buttons) */
    secondary: string
    /** Accent button (glopros.ai yellow CTA) */
    accent: string
    accentHover: string
    /** Long-form body copy, one step darker than textSecondary */
    textBody: string
    /** Stats band background */
    surfaceStats: string
    gradientHero: string
    gradientServices: string
    gradientFeature: string
    gradientFooter: string
  }
  typography: {
    fontBody: string
    fontHeading: string
  }
  spacing: {
    sectionPaddingY: string
    containerMaxWidth: string
    containerPaddingX: string
  }
  shape: {
    radiusSm: string
    radiusMd: string
    radiusLg: string
    radiusXl: string
    radiusFull: string
  }
  shadows: {
    shadowSm: string
    shadowMd: string
    shadowLg: string
    shadowCard: string
    shadowGlassInset: string
  }
}

export interface ThemeConfig {
  designStyle: DesignStyle
  defaultMode: ThemeMode
  light: ThemeTokens
  dark: ThemeTokens
}

const themeConfig: ThemeConfig = {
  designStyle: 'flat',
  defaultMode: 'light',
  light: {
    colors: {
      // Exact values from glopros.ai (Webflow shared CSS + computed styles, 2026-09-17)
      primary:      '#052D69',
      primaryHover: '#042454',
      primaryFg:    '#FFFFFF',
      primaryOnInverse: '#052D69',
      gradientAccent: 'linear-gradient(180deg, #F7FCFE 0%, #E4F4FB 55%, #D7EEF7 100%)',
      background:   '#FFFFFF',
      surface:      '#F5F8FA',
      surfaceHover: '#ECF5FF',
      surfaceInverse: '#E8F5FB',
      textOnInverse:  '#18233A',
      textPrimary:  '#18233A',
      textSecondary:'#676E81',
      textMuted:    'rgba(24,35,58,0.45)',
      border:       'rgba(6,59,131,0.10)',
      borderHover:  '#90A1B9',
      secondary:    '#3BA0C1',
      accent:       '#FFE27C',
      accentHover:  '#FECB4A',
      textBody:     '#414A61',
      surfaceStats: '#ECF5FF',
      gradientHero: 'radial-gradient(72.42% 71.91% at 50% 97.66%, rgba(130,168,218,0.5) 56.2%, rgba(217,242,249,0.5) 73.21%, rgba(234,246,250,0.5) 86.66%, rgba(255,255,255,0.5) 98.76%), linear-gradient(175deg, #FFFFFF 4.02%, #EAF6FA 54.13%, #DAF3FA 73.64%, #ACCBE7 84.24%, #82A8DA 94.77%)',
      gradientServices: 'linear-gradient(167deg, rgba(227,247,252,0.7) 9.25%, rgba(221,245,251,0.7) 65.24%, rgba(190,236,247,0.7) 90.75%)',
      gradientFeature: 'linear-gradient(rgba(244,250,255,0.44), rgba(201,232,240,0.44) 83%, rgba(146,208,228,0.44))',
      gradientFooter: 'linear-gradient(162deg, rgba(255,255,255,0.7) 4.3%, rgba(187,225,247,0.7))',
    },
    typography: {
      fontBody:    'var(--font-roboto), Roboto, system-ui, sans-serif',
      fontHeading: 'var(--font-montserrat), Montserrat, system-ui, sans-serif',
    },
    spacing: {
      sectionPaddingY:  'clamp(3.25rem, 7vw, 5.625rem)',
      containerMaxWidth:'86rem',
      containerPaddingX:'clamp(1rem, 4vw, 4rem)',
    },
    shape: {
      radiusSm:   '0.75rem',
      radiusMd:   '1rem',
      radiusLg:   '1.5rem',
      radiusXl:   '2.125rem',
      radiusFull: '3.125rem',
    },
    shadows: {
      shadowSm: '0 1px 2px 0 rgba(0,0,0,0.05)',
      shadowMd: '0 4px 6px -1px rgba(0,0,0,0.08)',
      shadowLg: '0 10px 15px -3px rgba(0,0,0,0.08)',
      shadowCard: '0 21px 42px rgba(199,217,223,0.61)',
      shadowGlassInset: 'inset 4px 4px 14.7px #FFFFFF, inset -4px -4px 22px rgba(59,160,193,0.08)',
    },
  },
  dark: {
    colors: {
      primary:      '#3BA0C1',
      primaryHover: '#2F87A5',
      primaryFg:    '#08111F',
      primaryOnInverse: '#3BA0C1',
      gradientAccent: 'linear-gradient(180deg, #1F2C48 0%, #18233A 100%)',
      background:   '#18233A',
      surface:      '#1F2C48',
      surfaceHover: '#27375A',
      surfaceInverse: '#1F2C48',
      textOnInverse:  '#F5F8FA',
      textPrimary:  '#F5F8FA',
      textSecondary:'rgba(245,248,250,0.72)',
      textMuted:    'rgba(245,248,250,0.45)',
      border:       'rgba(245,248,250,0.12)',
      borderHover:  'rgba(245,248,250,0.24)',
      secondary:    '#3BA0C1',
      accent:       '#FFE27C',
      accentHover:  '#FECB4A',
      textBody:     'rgba(245,248,250,0.80)',
      surfaceStats: '#1F2C48',
      gradientHero: 'linear-gradient(175deg, #18233A 0%, #1F2C48 100%)',
      gradientServices: 'linear-gradient(167deg, #1F2C48 0%, #27375A 100%)',
      gradientFeature: 'linear-gradient(#1F2C48, #27375A)',
      gradientFooter: 'linear-gradient(162deg, #1F2C48, #27375A)',
    },
    typography: {
      fontBody:    'var(--font-roboto), Roboto, system-ui, sans-serif',
      fontHeading: 'var(--font-montserrat), Montserrat, system-ui, sans-serif',
    },
    spacing: {
      sectionPaddingY:  'clamp(4rem, 14vw, 8.5rem)',
      containerMaxWidth:'72rem',
      containerPaddingX:'1.5rem',
    },
    shape: {
      radiusSm:   '0.25rem',
      radiusMd:   '0.5rem',
      radiusLg:   '0.75rem',
      radiusXl:   '1rem',
      radiusFull: '9999px',
    },
    shadows: {
      shadowSm: '0 1px 2px 0 rgba(0,0,0,0.3)',
      shadowMd: '0 4px 6px -1px rgba(0,0,0,0.4)',
      shadowLg: '0 10px 15px -3px rgba(0,0,0,0.5)',
      shadowCard: '0 21px 42px rgba(0,0,0,0.35)',
      shadowGlassInset: 'none',
    },
  },
}

export default themeConfig
