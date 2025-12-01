import { Pipe, PipeTransform } from '@angular/core';

/**
 * PIPE PARA FORMATEAR PRECIOS CON MONEDA
 *
 * Formatea números como precios con símbolo de moneda
 * y opciones de localización.
 *
 * @example
 * ```html
 * <span>{{ product.precio | currency:'MXN':'symbol':'1.2-2' }}</span>
 * <!-- Output: $1,250.50 -->
 *
 * <span>{{ product.precio | currency:'USD':'code' }}</span>
 * <!-- Output: USD 1,250.50 -->
 * ```
 */
@Pipe({
  name: 'currency',
  standalone: true,
  pure: true
})
export class CurrencyPipe implements PipeTransform {

  transform(
    value: number | string | null | undefined,
    currencyCode: string = 'MXN',
    display: 'symbol' | 'code' | 'name' = 'symbol',
    digitsInfo?: string
  ): string {
    if (value == null || value === '') return '';

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) return '';

    try {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: display,
        minimumFractionDigits: digitsInfo ? parseInt(digitsInfo.split('.')[1].split('-')[0]) : 2,
        maximumFractionDigits: digitsInfo ? parseInt(digitsInfo.split('.')[1].split('-')[1]) : 2
      }).format(numValue);
    } catch (error) {
      // Fallback si hay error de formato
      console.warn('Error formatting currency:', error);
      return `${currencyCode} ${numValue.toFixed(2)}`;
    }
  }
}