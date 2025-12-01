/**
 * Mapeo semántico de iconos por contexto
 *
 * USO:
 * - Usar SIEMPRE estos nombres en lugar de strings hardcodeados
 * - Permite cambiar iconos globalmente desde un solo lugar
 * - Mejora la semántica y legibilidad del código
 *
 * @example
 * ```html
 * <ion-icon [name]="ICON_MAP.NAV_HOME"></ion-icon>
 * <ion-icon [name]="ICON_MAP.ACTION_CREATE"></ion-icon>
 * ```
 */
export const ICON_MAP = {
  // ═══════════════════════════════════════════════════════════════════════
  // NAVEGACIÓN PRINCIPAL
  // ═══════════════════════════════════════════════════════════════════════
  NAV_HOME: 'home',
  NAV_POS: 'cart',
  NAV_INVENTORY: 'cube',
  NAV_REPORTS: 'stats-chart',
  NAV_PROFILE: 'person',

  // ═══════════════════════════════════════════════════════════════════════
  // ACCIONES CRUD (Create, Read, Update, Delete)
  // ═══════════════════════════════════════════════════════════════════════
  ACTION_CREATE: 'add-circle',
  ACTION_ADD: 'add',
  ACTION_EDIT: 'create',
  ACTION_DELETE: 'trash',
  ACTION_SAVE: 'save',
  ACTION_CANCEL: 'close-circle',
  ACTION_CLOSE: 'close',
  ACTION_CONFIRM: 'checkmark-circle',
  ACTION_CHECK: 'checkmark',

  // ═══════════════════════════════════════════════════════════════════════
  // ACCIONES DE UI
  // ═══════════════════════════════════════════════════════════════════════
  ACTION_SEARCH: 'search',
  ACTION_FILTER: 'filter',
  ACTION_REFRESH: 'refresh',
  ACTION_DOWNLOAD: 'download',
  ACTION_PRINT: 'print',
  ACTION_SHARE: 'share',
  ACTION_MORE: 'ellipsis-vertical',
  ACTION_MENU: 'menu',

  // ═══════════════════════════════════════════════════════════════════════
  // NAVEGACIÓN DIRECCIONAL
  // ═══════════════════════════════════════════════════════════════════════
  NAV_BACK: 'arrow-back',
  NAV_FORWARD: 'arrow-forward',
  NAV_DOWN: 'chevron-down',
  NAV_UP: 'chevron-up',
  NAV_LEFT: 'chevron-back',
  NAV_RIGHT: 'chevron-forward',

  // ═══════════════════════════════════════════════════════════════════════
  // ESTADOS Y ALERTAS
  // ═══════════════════════════════════════════════════════════════════════
  STATUS_SUCCESS: 'checkmark-circle',
  STATUS_ERROR: 'close-circle',
  STATUS_WARNING: 'warning',
  STATUS_INFO: 'information-circle',
  STATUS_ALERT: 'alert-circle',

  // ═══════════════════════════════════════════════════════════════════════
  // CONTEXTO FARMACÉUTICO
  // ═══════════════════════════════════════════════════════════════════════
  PRODUCT_MEDICINE: 'medkit',
  PRODUCT_GENERIC: 'pulse',
  PRODUCT_SCAN: 'barcode',
  CLIENT: 'person',
  CLIENTS: 'people',
  SUPPLIER: 'business',
  SALE: 'receipt',
  PAYMENT_CARD: 'card',
  PAYMENT_CASH: 'cash',
  CALENDAR: 'calendar',
  TIME: 'time',
  EXPIRY: 'calendar',
  STOCK: 'cube',

  // ═══════════════════════════════════════════════════════════════════════
  // VISTAS Y VISUALIZACIÓN
  // ═══════════════════════════════════════════════════════════════════════
  VIEW_LIST: 'list',
  VIEW_GRID: 'grid',
  VIEW_LAYERS: 'layers',
  VIEW_DOCUMENT: 'document-text',
  VIEW_CLIPBOARD: 'clipboard',

  // ═══════════════════════════════════════════════════════════════════════
  // AUTENTICACIÓN Y SEGURIDAD
  // ═══════════════════════════════════════════════════════════════════════
  AUTH_LOGIN: 'log-in',
  AUTH_LOGOUT: 'log-out',
  AUTH_PASSWORD_SHOW: 'eye',
  AUTH_PASSWORD_HIDE: 'eye-off',
  AUTH_LOCK: 'lock-closed',
  AUTH_UNLOCK: 'lock-open',

  // ═══════════════════════════════════════════════════════════════════════
  // CONFIGURACIÓN Y SISTEMA
  // ═══════════════════════════════════════════════════════════════════════
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications',
  HELP: 'help-circle',
  INFO: 'information-circle'
} as const;

/**
 * Tipo TypeScript para autocompletado
 */
export type IconName = typeof ICON_MAP[keyof typeof ICON_MAP];

/**
 * Tamaños estándar de iconos
 */
export const ICON_SIZES = {
  SMALL: 'small',      // 18px
  MEDIUM: 'medium',    // 24px (default)
  LARGE: 'large'       // 32px
} as const;

/**
 * Colores de iconos según contexto
 */
export const ICON_COLORS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  MEDIUM: 'medium',
  LIGHT: 'light',
  DARK: 'dark'
} as const;