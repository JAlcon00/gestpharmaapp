import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'text' | 'card' | 'list' | 'chart' | 'table';

/**
 * Componente Skeleton para mostrar placeholders animados durante la carga
 *
 * CUÁNDO USAR:
 * - Carga de datos de API
 * - Transiciones entre estados
 * - Mejora de la experiencia de carga
 *
 * @example
 * ```html
 * <!-- Texto básico -->
 * <app-skeleton variant="text" [lines]="3"></app-skeleton>
 *
 * <!-- Cards de productos -->
 * <app-skeleton variant="card" width="300px" height="200px"></app-skeleton>
 *
 * <!-- Lista de elementos -->
 * <app-skeleton variant="list" [items]="5"></app-skeleton>
 *
 * <!-- Gráfico -->
 * <app-skeleton variant="chart" width="100%" height="300px"></app-skeleton>
 *
 * <!-- Tabla -->
 * <app-skeleton variant="table" [tableRows]="10" [tableColumns]="4"></app-skeleton>
 * ```
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent {
  /** Variante del skeleton */
  @Input() variant: SkeletonVariant = 'text';

  /** Ancho personalizado */
  @Input() width = '100%';

  /** Alto personalizado */
  @Input() height = 'auto';

  /** Animación activada */
  @Input() animated = true;

  /** Número de líneas para variant="text" */
  @Input() lines = 1;

  /** Número de items para variant="list" */
  @Input() items = 3;

  /** Número de filas para variant="table" */
  @Input() tableRows = 5;

  /** Número de columnas para variant="table" */
  @Input() tableColumns = 3;

  /** Array para líneas */
  get linesArray(): number[] {
    return Array(this.lines).fill(0).map((_, i) => i);
  }

  /** Array para items */
  get itemsArray(): number[] {
    return Array(this.items).fill(0).map((_, i) => i);
  }

  /** Array para filas de tabla */
  get tableRowsArray(): number[] {
    return Array(this.tableRows).fill(0).map((_, i) => i);
  }

  /** Array para columnas de tabla */
  get tableColumnsArray(): number[] {
    return Array(this.tableColumns).fill(0).map((_, i) => i);
  }

  /** Genera ancho variable para líneas de texto */
  getLineWidth(lineIndex: number): number {
    const widths = [100, 85, 70, 95, 60, 80, 90, 75];
    return widths[lineIndex % widths.length];
  }

  /** Genera altura variable para barras de gráfico */
  getBarHeight(barIndex: number): number {
    const heights = [85, 60, 90, 45, 75, 55, 95, 70];
    return heights[barIndex % heights.length];
  }

  /** Genera ancho variable para celdas de tabla */
  getCellWidth(cellIndex: number): number {
    const widths = [25, 30, 20, 25, 15, 35, 22, 28];
    return widths[cellIndex % widths.length];
  }
}