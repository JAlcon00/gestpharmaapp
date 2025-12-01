import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreakpointService, Breakpoint } from '../../core/services/breakpoint.service';

/**
 * Directiva estructural para mostrar/ocultar contenido basado en breakpoints
 *
 * USO:
 * ```html
 * <!-- Mostrar solo en móviles -->
 * <div *appIfBreakpoint="'xs'">Contenido móvil</div>
 *
 * <!-- Mostrar en tablet y superior -->
 * <div *appIfBreakpoint="'md'; operator: 'gte'">Contenido tablet+</div>
 *
 * <!-- Ocultar en móviles -->
 * <div *appIfBreakpoint="'sm'; operator: 'lt'">No móvil</div>
 * ```
 */
@Directive({
  selector: '[appIfBreakpoint]',
  standalone: true
})
export class IfBreakpointDirective implements OnInit, OnDestroy {

  private readonly breakpointService = inject(BreakpointService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  private subscription?: Subscription;

  @Input('appIfBreakpoint') breakpoint!: Breakpoint;
  @Input('appIfBreakpointOperator') operator: 'eq' | 'gte' | 'lte' | 'gt' | 'lt' = 'eq';

  ngOnInit(): void {
    this.subscription = this.breakpointService.current$.subscribe(() => {
      this.updateView();
    });
    this.updateView();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateView(): void {
    const shouldShow = this.evaluateCondition();

    if (shouldShow) {
      if (!this.viewContainer.length) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
    }
  }

  private evaluateCondition(): boolean {
    const current = this.breakpointService.current;
    const target = this.breakpoint;

    switch (this.operator) {
      case 'eq':
        return current === target;
      case 'gte':
        return this.breakpointService.isAtLeast(target);
      case 'lte':
        return !this.breakpointService.isAtLeast(target) || current === target;
      case 'gt':
        return this.breakpointService.isAtLeast(target) && current !== target;
      case 'lt':
        return this.breakpointService.isLessThan(target);
      default:
        return false;
    }
  }
}