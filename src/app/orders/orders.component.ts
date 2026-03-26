import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth-service';
import { Order } from '../_models/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.orderService.getUserOrders(user.uid).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    } else {
      this.loading = false;
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      confirmed:  'bg-success bg-opacity-10 text-success border-success',
      processing: 'bg-warning bg-opacity-10 text-warning border-warning',
      shipped:    'bg-info bg-opacity-10 text-info border-info',
      delivered:  'bg-primary bg-opacity-10 text-primary border-primary',
    };
    return map[status] || 'bg-secondary bg-opacity-10 text-secondary';
  }

  getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      confirmed:  'fa-solid fa-circle-check',
      processing: 'fa-solid fa-gear fa-spin',
      shipped:    'fa-solid fa-truck',
      delivered:  'fa-solid fa-box-open',
    };
    return map[status] || 'fa-solid fa-circle-info';
  }
}
