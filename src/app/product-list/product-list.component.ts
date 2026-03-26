import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../_models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../service/agent.service';
import { AuthService } from '../service/auth-service';
import { CartService } from '../_service/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  loading: boolean = true;
  currentUser: any;

  constructor(
    private router: Router,
    private agentService: AgentService,
    private productservice: ProductService,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productservice.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
        this.loading = false;
      })
  }

  viewProduct(id?: string) {
    this.router.navigate([`/product/${id}`]);
  }

  isOwnProduct(product: Product): boolean {
    return !!this.currentUser && product.addedBy === this.currentUser.email;
  }

  addToCart(event: Event, product: Product) {
    event.stopPropagation(); // prevent card click from navigating
    if (!this.currentUser) {
      this.router.navigate(['/user-auth']);
      return;
    }
    this.cartService.addToCart(product, 1);
    this.router.navigate(['/cart']);
  }

  ionViewDidEnter() {
    this.agentService.logAnalyticsEvent('screen_view', {
      screen_id: 'app-product-list',
      screen_class: 'ProductListComponent',
      screen_type: 'Page'
    })
  }


}
