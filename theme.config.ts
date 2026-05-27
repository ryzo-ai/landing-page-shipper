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
      primary:      '#E0621A',
      primaryHover: '#c9571a',
      primaryFg:    '#FFFFFF',
      background:   '#F2EDE8',
      surface:      '#FAF7F4',
      surfaceHover: '#F5EEE7',
      textPrimary:  '#2D2926',
      textSecondary:'rgba(45,41,38,0.55)',
      textMuted:    'rgba(45,41,38,0.30)',
      border:       'rgba(45,41,38,0.10)',
      borderHover:  'rgba(45,41,38,0.20)',
    },
    typography: {
      fontBody:    'var(--font-geist), system-ui, sans-serif',
      fontHeading: 'var(--font-albra), Georgia, serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
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
      primary:      '#E0621A',
      primaryHover: '#c9571a',
      primaryFg:    '#FFFFFF',
      background:   '#2D2926',
      surface:      '#231F1C',
      surfaceHover: '#3a3330',
      textPrimary:  '#F2EDE8',
      textSecondary:'rgba(242,237,232,0.70)',
      textMuted:    'rgba(242,237,232,0.40)',
      border:       'rgba(242,237,232,0.10)',
      borderHover:  'rgba(242,237,232,0.20)',
    },
    typography: {
      fontBody:    'var(--font-geist), system-ui, sans-serif',
      fontHeading: 'var(--font-albra), Georgia, serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
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
