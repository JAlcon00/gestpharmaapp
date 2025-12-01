import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

/**
 * Directiva para mejorar accesibilidad con ARIA labels automáticos
 *
 * USO:
 * ```html
 * <button appAriaLabel="Eliminar producto">×</button>
 * <input appAriaLabel="Buscar productos" appAriaDescribedBy="search-help">
 * ```
 */
@Directive({
  selector: '[appAriaLabel]',
  standalone: true
})
export class AriaLabelDirective implements OnInit {

  @Input() appAriaLabel!: string;
  @Input() appAriaDescribedBy?: string;
  @Input() appAriaExpanded?: boolean;
  @Input() appAriaSelected?: boolean;

  private el = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    const element = this.el.nativeElement;

    // Aplicar aria-label si se proporciona
    if (this.appAriaLabel) {
      element.setAttribute('aria-label', this.appAriaLabel);
    }

    // Aplicar aria-describedby si se proporciona
    if (this.appAriaDescribedBy) {
      element.setAttribute('aria-describedby', this.appAriaDescribedBy);
    }

    // Aplicar aria-expanded si se proporciona
    if (this.appAriaExpanded !== undefined) {
      element.setAttribute('aria-expanded', this.appAriaExpanded.toString());
    }

    // Aplicar aria-selected si se proporciona
    if (this.appAriaSelected !== undefined) {
      element.setAttribute('aria-selected', this.appAriaSelected.toString());
    }

    // Agregar role si no tiene uno apropiado
    if (!element.hasAttribute('role') && this.needsRole(element)) {
      element.setAttribute('role', this.getAppropriateRole(element));
    }
  }

  private needsRole(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    return ['div', 'span', 'section', 'article'].includes(tagName) &&
           !element.hasAttribute('role');
  }

  private getAppropriateRole(_element: HTMLElement): string {
    // Lógica para determinar el role apropiado basado en el contexto
    // Esto es simplificado - en producción sería más complejo
    return 'region';
  }
}