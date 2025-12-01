import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'middle' | 'bottom';
  showCloseButton?: boolean;
  action?: {
    text: string;
    handler: () => void;
  };
}

/**
 * Servicio para mostrar notificaciones toast consistentes
 *
 * CARACTERÍSTICAS:
 * - 4 tipos semánticos (success, error, warning, info)
 * - Posicionamiento flexible
 * - Botón de acción opcional
 * - Accesible (screen readers)
 * - Duración configurable
 *
 * @example
 * ```typescript
 * constructor(private toastService: ToastService) {}
 *
 * // Toast de éxito
 * this.toastService.success('Producto agregado correctamente');
 *
 * // Toast de error
 * this.toastService.error('No se pudo guardar el producto');
 *
 * // Toast con acción
 * this.toastService.show({
 *   message: 'Producto eliminado',
 *   type: 'info',
 *   action: {
 *     text: 'Deshacer',
 *     handler: () => this.restoreProduct()
 *   }
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastController = inject(ToastController);

  /**
   * Muestra un toast de éxito
   */
  async success(message: string, duration = 3000): Promise<void> {
    await this.show({
      message,
      type: 'success',
      duration
    });
  }

  /**
   * Muestra un toast de error
   */
  async error(message: string, duration = 4000): Promise<void> {
    await this.show({
      message,
      type: 'error',
      duration
    });
  }

  /**
   * Muestra un toast de advertencia
   */
  async warning(message: string, duration = 3500): Promise<void> {
    await this.show({
      message,
      type: 'warning',
      duration
    });
  }

  /**
   * Muestra un toast de información
   */
  async info(message: string, duration = 3000): Promise<void> {
    await this.show({
      message,
      type: 'info',
      duration
    });
  }

  /**
   * Muestra un toast personalizado
   */
  async show(options: ToastOptions): Promise<void> {
    const {
      message,
      type = 'info',
      duration = 3000,
      position = 'bottom',
      showCloseButton = true,
      action
    } = options;

    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color: this.getColorForType(type),
      icon: this.getIconForType(type),
      buttons: this.getButtons(showCloseButton, action),
      cssClass: `toast-${type}`,
      animated: true,
      swipeGesture: 'vertical',
      // Accesibilidad
      htmlAttributes: {
        role: 'alert',
        'aria-live': type === 'error' ? 'assertive' : 'polite'
      }
    });

    await toast.present();
  }

  /**
   * Obtiene el color según el tipo
   */
  private getColorForType(type: ToastType): string {
    const colorMap: Record<ToastType, string> = {
      success: 'success',
      error: 'danger',
      warning: 'warning',
      info: 'primary'
    };
    return colorMap[type];
  }

  /**
   * Obtiene el icono según el tipo
   */
  private getIconForType(type: ToastType): string {
    const iconMap: Record<ToastType, string> = {
      success: 'checkmark-circle',
      error: 'close-circle',
      warning: 'warning',
      info: 'information-circle'
    };
    return iconMap[type];
  }

  /**
   * Genera los botones del toast
   */
  private getButtons(
    showCloseButton: boolean,
    action?: ToastOptions['action']
  ): any[] {
    const buttons: any[] = [];

    if (action) {
      buttons.push({
        text: action.text,
        handler: action.handler
      });
    }

    if (showCloseButton) {
      buttons.push({
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Toast se cierra automáticamente
        }
      });
    }

    return buttons;
  }
}