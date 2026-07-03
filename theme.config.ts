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
      primary:      '#FD5750',
      primaryHover: '#E64843',
      primaryFg:    '#FFFFFF',
      background:   '#FFFFFF',
      surface:      '#F2F3F6',
      surfaceHover: '#E5E9EF',
      surfaceInverse: '#0F2240',
      textOnInverse:  '#F2F3F6',
      textPrimary:  '#0F2240',
      textSecondary:'rgba(15,34,64,0.65)',
      textMuted:    'rgba(15,34,64,0.40)',
      border:       'rgba(15,34,64,0.10)',
      borderHover:  'rgba(15,34,64,0.20)',
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
      primary:      '#FD5750',
      primaryHover: '#E64843',
      primaryFg:    '#FFFFFF',
      background:   '#0F2240',
      surface:      '#16305A',
      surfaceHover: '#1D3D70',
      surfaceInverse: '#16305A',
      textOnInverse:  '#F2F3F6',
      textPrimary:  '#F2F3F6',
      textSecondary:'rgba(242,243,246,0.70)',
      textMuted:    'rgba(242,243,246,0.40)',
      border:       'rgba(242,243,246,0.10)',
      borderHover:  'rgba(242,243,246,0.20)',
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
