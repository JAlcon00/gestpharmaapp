import { Pipe, PipeTransform } from '@angular/core';

/**
 * PIPE PARA FILTRAR ARRAYS
 *
 * Filtra arrays de objetos basado en una propiedad y término de búsqueda.
 * Soporta búsqueda en múltiples propiedades.
 *
 * @example
 * ```html
 * <!-- Filtrar por nombre -->
 * <div *ngFor="let product of products | filter:'nombre':searchTerm">
 *   {{ product.nombre }}
 * </div>
 *
 * <!-- Filtrar por múltiples propiedades -->
 * <div *ngFor="let product of products | filter:['nombre','descripcion']:searchTerm">
 *   {{ product.nombre }}
 * </div>
 * ```
 */
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false // Necesario para que reaccione a cambios en searchTerm
})
export class FilterPipe implements PipeTransform {

  transform<T>(
    items: T[] | null | undefined,
    property: keyof T | (keyof T)[],
    searchTerm: string | null | undefined
  ): T[] {
    if (!items) return [];
    if (!searchTerm || searchTerm.trim() === '') return items;

    const term = searchTerm.toLowerCase().trim();
    const properties = Array.isArray(property) ? property : [property];

    return items.filter(item => {
      return properties.some(prop => {
        const value = item[prop];
        if (value == null) return false;

        const stringValue = String(value).toLowerCase();
        return stringValue.includes(term);
      });
    });
  }
}