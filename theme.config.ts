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
      primary:      '#052D69',
      primaryHover: '#041F4A',
      primaryFg:    '#FFFFFF',
      primaryOnInverse: '#052D69',
      gradientAccent: 'linear-gradient(180deg, #F7FCFE 0%, #E4F4FB 55%, #D7EEF7 100%)',
      background:   '#FFFFFF',
      surface:      '#F5F8FA',
      surfaceHover: '#DEEDFB',
      surfaceInverse: '#E8F5FB',
      textOnInverse:  '#18233A',
      textPrimary:  '#18233A',
      textSecondary:'rgba(24,35,58,0.68)',
      textMuted:    'rgba(24,35,58,0.45)',
      border:       'rgba(24,35,58,0.10)',
      borderHover:  'rgba(24,35,58,0.22)',
    },
    typography: {
      fontBody:    'var(--font-roboto), system-ui, sans-serif',
      fontHeading: 'var(--font-roboto), system-ui, sans-serif',
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
      shadowSm: '0 1px 2px 0 rgba(0,0,0,0.05)',
      shadowMd: '0 4px 6px -1px rgba(0,0,0,0.08)',
      shadowLg: '0 10px 15px -3px rgba(0,0,0,0.08)',
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
    },
    typography: {
      fontBody:    'var(--font-roboto), system-ui, sans-serif',
      fontHeading: 'var(--font-roboto), system-ui, sans-serif',
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
    },
  },
}

export default themeConfig
