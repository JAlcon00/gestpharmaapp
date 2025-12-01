import { Injectable } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  // ━━━ NAVEGACIÓN PRINCIPAL ━━━
  homeOutline, homeSharp,
  cartOutline, cartSharp,
  cubeOutline, cubeSharp,
  statsChartOutline, statsChartSharp,
  personOutline, personSharp,

  // ━━━ ACCIONES CRUD ━━━
  addOutline, addCircleOutline, addSharp,
  removeOutline, removeCircleOutline, removeSharp,
  trashOutline, trashSharp,
  createOutline, createSharp,
  saveOutline, saveSharp,
  closeOutline, closeCircleOutline, closeSharp,
  checkmarkOutline, checkmarkCircleOutline, checkmarkSharp,

  // ━━━ UI Y NAVEGACIÓN ━━━
  searchOutline, searchSharp,
  filterOutline, filterSharp,
  refreshOutline, refreshSharp,
  downloadOutline, downloadSharp,
  printOutline, printSharp,
  shareOutline, shareSharp,
  arrowBackOutline, arrowForwardOutline,
  chevronBackOutline, chevronForwardOutline,
  chevronDownOutline, chevronUpOutline,

  // ━━━ ESTADOS Y ALERTAS ━━━
  alertCircleOutline, alertCircleSharp,
  warningOutline, warningSharp,
  informationCircleOutline, informationCircleSharp,
  checkmarkCircleSharp,
  closeCircleSharp,

  // ━━━ FARMACIA ESPECÍFICO ━━━
  medkitOutline, medkitSharp,           // Medicamentos
  pulseOutline, pulseSharp,             // Salud, urgencia
  calendarOutline, calendarSharp,       // Fechas, caducidad
  timeOutline, timeSharp,               // Horarios
  receiptOutline, receiptSharp,         // Ventas, facturas
  cardOutline, cardSharp,               // Pago con tarjeta
  cashOutline, cashSharp,               // Pago en efectivo
  peopleOutline, peopleSharp,           // Clientes
  businessOutline, businessSharp,       // Proveedores
  barcodeOutline, barcodeSharp,         // Código de barras

  // ━━━ MENÚ Y CONFIGURACIÓN ━━━
  menuOutline, menuSharp,
  ellipsisHorizontalOutline, ellipsisVerticalOutline,
  settingsOutline, settingsSharp,
  logOutOutline, logOutSharp,
  eyeOutline, eyeOffOutline,
  notificationsOutline, notificationsSharp,

  // ━━━ OTROS ━━━
  documentTextOutline, documentTextSharp,
  clipboardOutline, clipboardSharp,
  listOutline, listSharp,
  gridOutline, gridSharp,
  layersOutline, layersSharp
} from 'ionicons/icons';

/**
 * Servicio centralizado para gestión de iconos
 *
 * RESPONSABILIDADES:
 * - Registrar todos los iconos necesarios al inicio
 * - Proveer método para obtener icono según plataforma
 * - Mantener consistencia en el uso de iconos
 *
 * @example
 * ```typescript
 * constructor(private iconService: IconService) {}
 *
 * getHomeIcon() {
 *   return this.iconService.getIcon('home');
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor() {
    this.registerAllIcons();
  }

  /**
   * Registra todos los iconos en la aplicación
   * LLAMAR UNA SOLA VEZ al inicio (app.component)
   */
  private registerAllIcons(): void {
    addIcons({
      // Navegación principal
      'home-outline': homeOutline,
      'home-sharp': homeSharp,
      'cart-outline': cartOutline,
      'cart-sharp': cartSharp,
      'cube-outline': cubeOutline,
      'cube-sharp': cubeSharp,
      'stats-chart-outline': statsChartOutline,
      'stats-chart-sharp': statsChartSharp,
      'person-outline': personOutline,
      'person-sharp': personSharp,

      // Acciones CRUD
      'add-outline': addOutline,
      'add-circle-outline': addCircleOutline,
      'add-sharp': addSharp,
      'remove-outline': removeOutline,
      'remove-circle-outline': removeCircleOutline,
      'remove-sharp': removeSharp,
      'trash-outline': trashOutline,
      'trash-sharp': trashSharp,
      'create-outline': createOutline,
      'create-sharp': createSharp,
      'save-outline': saveOutline,
      'save-sharp': saveSharp,
      'close-outline': closeOutline,
      'close-circle-outline': closeCircleOutline,
      'close-sharp': closeSharp,
      'checkmark-outline': checkmarkOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'checkmark-sharp': checkmarkSharp,

      // UI y navegación
      'search-outline': searchOutline,
      'search-sharp': searchSharp,
      'filter-outline': filterOutline,
      'filter-sharp': filterSharp,
      'refresh-outline': refreshOutline,
      'refresh-sharp': refreshSharp,
      'download-outline': downloadOutline,
      'download-sharp': downloadSharp,
      'print-outline': printOutline,
      'print-sharp': printSharp,
      'share-outline': shareOutline,
      'share-sharp': shareSharp,
      'arrow-back-outline': arrowBackOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'chevron-back-outline': chevronBackOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'chevron-down-outline': chevronDownOutline,
      'chevron-up-outline': chevronUpOutline,

      // Estados y alertas
      'alert-circle-outline': alertCircleOutline,
      'alert-circle-sharp': alertCircleSharp,
      'warning-outline': warningOutline,
      'warning-sharp': warningSharp,
      'information-circle-outline': informationCircleOutline,
      'information-circle-sharp': informationCircleSharp,
      'checkmark-circle-sharp': checkmarkCircleSharp,
      'close-circle-sharp': closeCircleSharp,

      // Farmacia específico
      'medkit-outline': medkitOutline,
      'medkit-sharp': medkitSharp,
      'pulse-outline': pulseOutline,
      'pulse-sharp': pulseSharp,
      'calendar-outline': calendarOutline,
      'calendar-sharp': calendarSharp,
      'time-outline': timeOutline,
      'time-sharp': timeSharp,
      'receipt-outline': receiptOutline,
      'receipt-sharp': receiptSharp,
      'card-outline': cardOutline,
      'card-sharp': cardSharp,
      'cash-outline': cashOutline,
      'cash-sharp': cashSharp,
      'people-outline': peopleOutline,
      'people-sharp': peopleSharp,
      'business-outline': businessOutline,
      'business-sharp': businessSharp,
      'barcode-outline': barcodeOutline,
      'barcode-sharp': barcodeSharp,

      // Menú y configuración
      'menu-outline': menuOutline,
      'menu-sharp': menuSharp,
      'ellipsis-horizontal-outline': ellipsisHorizontalOutline,
      'ellipsis-vertical-outline': ellipsisVerticalOutline,
      'settings-outline': settingsOutline,
      'settings-sharp': settingsSharp,
      'log-out-outline': logOutOutline,
      'log-out-sharp': logOutSharp,
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'notifications-outline': notificationsOutline,
      'notifications-sharp': notificationsSharp,

      // Otros
      'document-text-outline': documentTextOutline,
      'document-text-sharp': documentTextSharp,
      'clipboard-outline': clipboardOutline,
      'clipboard-sharp': clipboardSharp,
      'list-outline': listOutline,
      'list-sharp': listSharp,
      'grid-outline': gridOutline,
      'grid-sharp': gridSharp,
      'layers-outline': layersOutline,
      'layers-sharp': layersSharp
    });
  }

  /**
   * Obtiene el nombre completo del icono según la plataforma
   * iOS: outline | Android: sharp
   *
   * @param baseName - Nombre base del icono (sin sufijo)
   * @returns Nombre completo con sufijo de plataforma
   *
   * @example
   * ```typescript
   * this.iconService.getIcon('home') // => 'home-outline' en iOS
   * ```
   */
  getIcon(baseName: string): string {
    const platform = this.getPlatform();
    const suffix = platform === 'ios' ? 'outline' : 'sharp';
    return `${baseName}-${suffix}`;
  }

  /**
   * Detecta la plataforma actual
   * @private
   */
  private getPlatform(): 'ios' | 'android' | 'web' {
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    }

    // Por defecto, usar estilo iOS (outline) para web
    return 'ios';
  }
}