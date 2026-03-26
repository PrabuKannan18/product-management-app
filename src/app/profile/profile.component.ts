import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { ProductService } from '../product.service';
import { OrderService } from '../service/order.service';
import { Product } from '../_models/product';
import { Order } from '../_models/order';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;

  myProducts: Product[] = [];
  myOrders: Order[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadUserStats();
    } else {
      this.loading = false;
    }
  }

  loadUserStats() {
    this.productService.getProducts().subscribe(allProducts => {
      this.myProducts = allProducts.filter(p => p.addedBy === this.user.email);
    });

    this.orderService.getUserOrders(this.user.uid).subscribe(orders => {
      this.myOrders = orders;
      this.loading = false;
    });
  }

  getTotalSpent(): number {
    return this.myOrders.reduce((acc, current) => acc + current.total, 0);
  }
}
