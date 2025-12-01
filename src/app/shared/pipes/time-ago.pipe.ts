import { Pipe, PipeTransform } from '@angular/core';

/**
 * PIPE PARA FORMATEAR FECHAS RELATIVAS
 *
 * Convierte fechas absolutas en descripciones relativas
 * útiles para timestamps en la UI.
 *
 * @example
 * ```html
 * <span>{{ sale.fecha | timeAgo }}</span>
 * <!-- Output: "hace 2 horas", "ayer", "hace 3 días" -->
 * ```
 */
@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date | number | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Menos de 1 minuto
    if (diffSeconds < 60) {
      return 'ahora mismo';
    }

    // Menos de 1 hora
    if (diffMinutes < 60) {
      return `hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    }

    // Menos de 24 horas
    if (diffHours < 24) {
      return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    }

    // Menos de 7 días
    if (diffDays < 7) {
      if (diffDays === 1) return 'ayer';
      return `hace ${diffDays} días`;
    }

    // Más de 7 días - mostrar fecha
    return this.formatDate(date);
  }

  private formatDate(date: Date): string {
    const now = new Date();
    const currentYear = now.getFullYear();
    const dateYear = date.getFullYear();

    if (dateYear === currentYear) {
      // Este año - mostrar día y mes
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    } else {
      // Otro año - mostrar día, mes y año
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }
}