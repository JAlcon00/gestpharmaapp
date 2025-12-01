import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

export type KpiType = 'sales' | 'products' | 'stock' | 'clients' | 'revenue';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class KpiCardComponent implements OnInit, AfterViewInit {
  @Input() type: KpiType = 'sales';
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() trend?: number;
  @Input() trendLabel?: string;
  @Input() subtitle?: string;
  @Input() icon: string = '';
  @Input() isHero: boolean = false;
  @Input() sparklineData: number[] = [];

  @ViewChild('counter', { static: false }) counterElement?: ElementRef;

  displayValue: string = '0';
  sparklinePath: string = '';
  glowColor: string = '';

  private observer?: IntersectionObserver;

  ngOnInit() {
    this.setIconAndGlow();
    this.generateSparkline();
    this.formatDisplayValue();
  }

  ngAfterViewInit() {
    this.setupCounterAnimation();
  }

  private setIconAndGlow() {
    const iconMap: Record<KpiType, { icon: string, glow: string }> = {
      sales: { icon: 'trending-up-outline', glow: 'var(--glow-primary)' },
      products: { icon: 'cube-outline', glow: 'var(--glow-primary)' },
      stock: { icon: 'cart-outline', glow: 'var(--glow-danger)' },
      clients: { icon: 'people-outline', glow: 'var(--glow-primary)' },
      revenue: { icon: 'cash-outline', glow: 'var(--glow-success)' }
    };

    const config = iconMap[this.type];
    if (!this.icon) {
      this.icon = config.icon;
    }
    this.glowColor = config.glow;
  }

  private formatDisplayValue() {
    if (this.type === 'sales' || this.type === 'revenue') {
      // Formato monetario
      this.displayValue = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(this.value);
    } else {
      // Formato numérico regular
      this.displayValue = this.value.toLocaleString('es-MX');
    }
  }

  private generateSparkline() {
    if (!this.sparklineData.length) return;

    const width = 80;
    const height = 20;
    const max = Math.max(...this.sparklineData);
    const min = Math.min(...this.sparklineData);

    const points = this.sparklineData.map((value, index) => {
      const x = (index / (this.sparklineData.length - 1)) * width;
      const y = height - ((value - min) / (max - min)) * height;
      return `${x},${y}`;
    });

    this.sparklinePath = `M${points.join(' L')}`;
  }

  private setupCounterAnimation() {
    if (!this.counterElement) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter();
          this.observer?.unobserve(entry.target);
        }
      });
    });

    this.observer.observe(this.counterElement.nativeElement);
  }

  private animateCounter() {
    const duration = 1500;
    const startValue = 0;
    const endValue = this.value;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = startValue + (endValue - startValue) * easedProgress;

      if (this.type === 'sales' || this.type === 'revenue') {
        this.displayValue = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(currentValue);
      } else {
        this.displayValue = Math.round(currentValue).toLocaleString('es-MX');
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}