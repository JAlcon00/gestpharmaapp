import { Directive, ElementRef, Input, OnInit, OnDestroy, inject } from '@angular/core';

/**
 * Directiva para mejorar navegación por teclado y manejo de foco
 *
 * CARACTERÍSTICAS:
 * - Auto-enfoque en elementos específicos
 * - Manejo de trap de foco en modales
 * - Skip links para navegación rápida
 * - Indicadores visuales de foco
 *
 * USO:
 * ```html
 * <!-- Auto-enfoque -->
 * <input appFocus [autoFocus]="true">
 *
 * <!-- Trap de foco en modal -->
 * <div appFocusTrap>
 *   <button>Contenido</button>
 * </div>
 *
 * <!-- Skip link -->
 * <a appSkipLink="main-content">Saltar al contenido principal</a>
 * ```
 */
@Directive({
  selector: '[appFocus],[appFocusTrap],[appSkipLink]',
  standalone: true
})
export class FocusDirective implements OnInit, OnDestroy {

  @Input('appFocus') focusOptions?: { autoFocus?: boolean; delay?: number };
  @Input('appSkipLink') skipTarget?: string;

  private focusTrapActive = false;
  private originalFocus?: HTMLElement;
  private focusableElements: HTMLElement[] = [];

  private el = inject(ElementRef<HTMLElement>);

  ngOnInit(): void {
    const element = this.el.nativeElement;

    // Auto-enfoque
    if (this.focusOptions?.autoFocus) {
      const delay = this.focusOptions.delay || 0;
      setTimeout(() => {
        element.focus();
      }, delay);
    }

    // Skip link
    if (this.skipTarget) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        this.skipToTarget();
      });
    }

    // Focus trap (si es modal o similar)
    if (element.hasAttribute('appFocusTrap')) {
      this.setupFocusTrap();
    }
  }

  ngOnDestroy(): void {
    if (this.focusTrapActive) {
      this.teardownFocusTrap();
    }
  }

  private skipToTarget(): void {
    if (this.skipTarget) {
      const target = document.getElementById(this.skipTarget);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  private setupFocusTrap(): void {
    this.focusTrapActive = true;
    this.originalFocus = document.activeElement as HTMLElement;

    // Encontrar elementos enfocables dentro del trap
    this.updateFocusableElements();

    // Escuchar cambios en el DOM
    const observer = new MutationObserver(() => {
      this.updateFocusableElements();
    });

    observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true
    });

    // Manejar navegación por teclado
    this.el.nativeElement.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Enfocar primer elemento
    setTimeout(() => {
      if (this.focusableElements.length > 0) {
        this.focusableElements[0].focus();
      }
    }, 100);
  }

  private teardownFocusTrap(): void {
    this.focusTrapActive = false;
    this.el.nativeElement.removeEventListener('keydown', this.handleKeyDown.bind(this));

    // Restaurar foco original
    if (this.originalFocus) {
      this.originalFocus.focus();
    }
  }

  private updateFocusableElements(): void {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    this.focusableElements = Array.from(
      this.el.nativeElement.querySelectorAll(focusableSelectors.join(', '))
    ) as HTMLElement[];
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.focusTrapActive) return;

    if (event.key === 'Tab') {
      event.preventDefault();

      const currentIndex = this.focusableElements.indexOf(document.activeElement as HTMLElement);
      let nextIndex: number;

      if (event.shiftKey) {
        // Tab hacia atrás
        nextIndex = currentIndex > 0 ? currentIndex - 1 : this.focusableElements.length - 1;
      } else {
        // Tab hacia adelante
        nextIndex = currentIndex < this.focusableElements.length - 1 ? currentIndex + 1 : 0;
      }

      this.focusableElements[nextIndex].focus();
    }

    // Escape para salir del trap (opcional)
    if (event.key === 'Escape') {
      this.teardownFocusTrap();
    }
  }
}