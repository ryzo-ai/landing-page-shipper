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
    // Brand accent tokens — mirror playlistpush.com :root (read 2026-08-31)
    salmon: string
    teal: string
    star: string
    blueHighlight: string
    redOnDark: string
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
      primary:      '#E85154',   // --red
      primaryHover: '#EF5D60',   // brand lightens on hover
      primaryFg:    '#FFFFFF',
      background:   '#FFFFFF',
      surface:      '#F2F3F6',   // --gray-bg
      surfaceHover: '#E5E9EF',
      surfaceInverse: '#0F2240', // --navy
      textOnInverse:  '#F2F3F6',
      textPrimary:  '#0F2240',   // --navy
      textSecondary:'rgba(15,34,64,0.65)',
      textMuted:    '#A7B1C1',   // --muted
      border:       '#D8DFE9',   // --gray-line
      borderHover:  'rgba(15,34,64,0.20)',
      salmon:        '#E37577',  // --salmon
      teal:          '#00F2EA',  // --teal
      star:          '#169FE7',  // --star
      blueHighlight: '#4256E8',  // --blue-hl
      redOnDark:     '#FF7A6E',  // --red-on-dark
    },
    typography: {
      fontBody:    'var(--font-geist), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontHeading: 'var(--font-geist), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
      containerMaxWidth:'1140px',
      containerPaddingX:'1.5rem',
    },
    shape: {
      radiusSm:   '12px',
      radiusMd:   '20px',
      radiusLg:   '28px',
      radiusXl:   '36px',
      radiusFull: '9999px',
    },
    shadows: {
      shadowSm: '0 2px 6px -2px rgba(15,34,64,0.10)',
      shadowMd: '0 10px 24px -10px rgba(15,34,64,0.18)',
      shadowLg: '0 20px 50px -20px rgba(15,34,64,0.25)',
    },
  },
  dark: {
    colors: {
      primary:      '#FF7A6E',   // --red-on-dark
      primaryHover: '#FF8F85',
      primaryFg:    '#0F2240',
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
      salmon:        '#E37577',
      teal:          '#00F2EA',
      star:          '#169FE7',
      blueHighlight: '#4256E8',
      redOnDark:     '#FF7A6E',
    },
    typography: {
      fontBody:    'var(--font-geist), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontHeading: 'var(--font-geist), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    spacing: {
      sectionPaddingY:  '6rem',
      containerMaxWidth:'1140px',
      containerPaddingX:'1.5rem',
    },
    shape: {
      radiusSm:   '12px',
      radiusMd:   '20px',
      radiusLg:   '28px',
      radiusXl:   '36px',
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
