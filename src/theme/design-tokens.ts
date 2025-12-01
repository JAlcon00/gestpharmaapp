export const DesignTokens = {
  // ESPACIADO (Escala Fibonacci Modificada - Sistema de 4px)
  spacing: {
    xxs: '2px',     // Espacios mínimos
    xs: '4px',      // Espacios muy pequeños
    sm: '8px',      // Espacios pequeños
    md: '12px',     // Espacios medianos
    base: '16px',   // Espacio base (1rem)
    lg: '24px',     // Espacios grandes
    xl: '32px',     // Espacios muy grandes
    '2xl': '48px',  // Espacios extra grandes
    '3xl': '64px',  // Espacios masivos
    '4xl': '96px'   // Espacios hero
  },

  // ANCHOS DE CONTENEDOR
  container: {
    xs: '400px',    // Contenedores muy pequeños
    sm: '640px',    // Contenedores pequeños
    md: '768px',    // Contenedores medianos
    lg: '1024px',   // Contenedores grandes
    xl: '1280px',   // Contenedores extra grandes
    '2xl': '1536px' // Contenedores hero
  },

  // MÁRGENES SEMÁNTICOS
  margin: {
    section: '64px',  // Márgenes entre secciones
    component: '24px', // Márgenes entre componentes
    item: '12px'       // Márgenes entre items
  },

  // RADIOS DE BORDE (Border Radius Progresivo)
  borderRadius: {
    none: '0',
    xs: '4px',        // Chips, badges
    sm: '8px',        // Botones pequeños
    md: '12px',       // Botones normales, inputs
    lg: '16px',       // Cards, modales
    xl: '24px',       // Cards destacados
    '2xl': '32px',    // Hero sections
    full: '9999px',   // Botones circulares, avatares
    blob: '30% 70% 70% 30% / 30% 30% 70% 70%'  // Formas orgánicas
  },

  // SOMBRAS CON PROFUNDIDAD Y COLOR (Usando colores de marca)
  shadows: {
    none: 'none',
    xs: '0 1px 2px rgba(0, 217, 163, 0.05)',
    sm: '0 2px 4px rgba(0, 217, 163, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 8px rgba(0, 217, 163, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
    lg: '0 12px 24px rgba(0, 217, 163, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)',
    xl: '0 20px 40px rgba(0, 217, 163, 0.2), 0 8px 16px rgba(0, 0, 0, 0.08)',
    '2xl': '0 32px 64px rgba(0, 217, 163, 0.25), 0 16px 32px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    'inner-strong': 'inset 0 4px 8px rgba(0, 0, 0, 0.1)',
    outline: '0 0 0 3px rgba(102, 126, 234, 0.5)'
  },

  // TRANSICIONES Y ANIMACIONES
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    slowest: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
  },

  // DURACIONES DE ANIMACIÓN
  durations: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
    slowest: '750ms'
  },

  // EASING FUNCTIONS (Curvas de animación)
  easing: {
    linear: 'cubic-bezier(0, 0, 1, 1)',
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // BREAKPOINTS RESPONSIVE
  breakpoints: {
    xs: '0px',       // Móviles pequeños
    sm: '576px',     // Móviles grandes
    md: '768px',     // Tablets portrait
    lg: '992px',     // Tablets landscape
    xl: '1200px',    // Desktop
    xxl: '1400px'    // Desktop grande
  },

  // Z-INDEX (Capas de elementos)
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
    overlay: 9999
  },

  // OPACIDAD
  opacity: {
    disabled: 0.4,
    hover: 0.8,
    active: 0.6,
    overlay: 0.5,
    subtle: 0.6
  }
} as const;

export type SpacingKey = keyof typeof DesignTokens.spacing;
export type BorderRadiusKey = keyof typeof DesignTokens.borderRadius;
export type ShadowKey = keyof typeof DesignTokens.shadows;