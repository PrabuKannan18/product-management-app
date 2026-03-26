import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../service/toast.service';
import { Toast } from '../_models/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed end-0 p-3" style="bottom: 1.5rem; z-index: 9999; min-width: 300px; max-width: 380px;">
      <div *ngFor="let toast of toasts" class="toast-item d-flex align-items-start gap-3 py-3 px-4 rounded-4 shadow mb-2"
           [ngClass]="getClasses(toast)" style="animation: slideIn 0.3s ease-out;">
        <i class="mt-1 fs-6" [ngClass]="getIcon(toast.type)"></i>
        <div class="flex-grow-1">
          <p class="mb-0 small fw-semibold">{{ toast.message }}</p>
        </div>
        <button class="btn-close btn-close-sm ms-auto opacity-75" (click)="dismiss(toast.id)" style="font-size: 0.6rem;"></button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .toast-item { backdrop-filter: blur(6px); }
    .toast-success { background: #dcfce7; color: #15803d; border-left: 4px solid #22c55e; }
    .toast-error   { background: #fee2e2; color: #b91c1c; border-left: 4px solid #ef4444; }
    .toast-info    { background: #ede9fe; color: #5b21b6; border-left: 4px solid #8b5cf6; }
    .toast-warning { background: #fef9c3; color: #854d0e; border-left: 4px solid #eab308; }
  `]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts.subscribe(toasts => (this.toasts = toasts));
  }

  dismiss(id: number) { this.toastService.dismiss(id); }

  getClasses(toast: Toast): string { return `toast-${toast.type}`; }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'fa-solid fa-circle-check',
      error:   'fa-solid fa-circle-xmark',
      info:    'fa-solid fa-circle-info',
      warning: 'fa-solid fa-triangle-exclamation',
    };
    return icons[type] || icons['info'];
  }
}
