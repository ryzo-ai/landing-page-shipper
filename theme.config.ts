export type DesignStyle = 'flat' | 'gradient' | 'skeuomorphic'
export type ThemeMode = 'light' | 'dark'

export interface ThemeTokens {
  colors: {
    primary: string
    primaryHover: string
    primaryFg: string
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
      primary:      '#642EFF',
      primaryHover: '#5326D9',
      primaryFg:    '#FFFFFF',
      background:   '#FFFFFF',
      surface:      '#F3F5FB',
      surfaceHover: '#E4E6F1',
      surfaceInverse: '#160042',
      textOnInverse:  '#F3F5FB',
      textPrimary:  '#160042',
      textSecondary:'rgba(22,0,66,0.65)',
      textMuted:    'rgba(22,0,66,0.40)',
      border:       'rgba(22,0,66,0.10)',
      borderHover:  'rgba(22,0,66,0.20)',
    },
    typography: {
      fontBody:    'var(--font-poppins), system-ui, sans-serif',
      fontHeading: 'var(--font-poppins), system-ui, sans-serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
      containerMaxWidth:'72rem',
      containerPaddingX:'1.5rem',
    },
    shape: {
      radiusSm:   '0.375rem',
      radiusMd:   '0.75rem',
      radiusLg:   '1rem',
      radiusXl:   '1.5rem',
      radiusFull: '9999px',
    },
    shadows: {
      shadowSm: '0 1px 2px 0 rgba(22,0,66,0.06)',
      shadowMd: '0 4px 10px -1px rgba(22,0,66,0.10)',
      shadowLg: '0 12px 24px -4px rgba(22,0,66,0.12)',
    },
  },
  dark: {
    colors: {
      primary:      '#8B5CFF',
      primaryHover: '#642EFF',
      primaryFg:    '#FFFFFF',
      background:   '#160042',
      surface:      '#20094F',
      surfaceHover: '#2B1263',
      surfaceInverse: '#20094F',
      textOnInverse:  '#F3F5FB',
      textPrimary:  '#F3F5FB',
      textSecondary:'rgba(243,245,251,0.70)',
      textMuted:    'rgba(243,245,251,0.40)',
      border:       'rgba(243,245,251,0.10)',
      borderHover:  'rgba(243,245,251,0.20)',
    },
    typography: {
      fontBody:    'var(--font-poppins), system-ui, sans-serif',
      fontHeading: 'var(--font-poppins), system-ui, sans-serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
      containerMaxWidth:'72rem',
      containerPaddingX:'1.5rem',
    },
    shape: {
      radiusSm:   '0.375rem',
      radiusMd:   '0.75rem',
      radiusLg:   '1rem',
      radiusXl:   '1.5rem',
      radiusFull: '9999px',
    },
    shadows: {
      shadowSm: '0 1px 2px 0 rgba(0,0,0,0.3)',
      shadowMd: '0 4px 10px -1px rgba(0,0,0,0.4)',
      shadowLg: '0 12px 24px -4px rgba(0,0,0,0.5)',
    },
  },
}

export default themeConfig
