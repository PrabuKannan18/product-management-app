import { Component, OnInit } from '@angular/core';
import { Product } from '../_models/product';
import { CartService } from '../_service/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgentService } from '../service/agent.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];
  total: number = 0;

  constructor(private cartService: CartService,
    private agentService: AgentService  // Inject the AgentService

  ) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getToCart();
    this.calculateTotal();
  }

  removeFromCart(productId?: string): void {
    if (productId) {
      this.cartService.removeFromCart(productId);
      this.cartItems = this.cartService.getToCart();
      this.calculateTotal();
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    if (productId) {
      this.cartService.updateQuantity(productId, quantity);
      this.cartItems = this.cartService.getToCart();
      this.calculateTotal();
    }
  }

  incrementQuantity(productId: string): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item && item.quantity < item.product.quantity) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: string): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }


  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.total = 0;
  }

  ionViewDidEnter() {
    this.agentService.logAnalyticsEvent('screen_view', {
      screen_id: 'app-cart',
      screen_class: 'CartComponent',
      screen_type: 'Page'
    })
  }
}
