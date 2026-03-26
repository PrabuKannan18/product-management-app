import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../_service/cart.service';
import { AgentService } from '../service/agent.service';
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth-service';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {

  processing: boolean = false;
  paymentSuccess: boolean = false;
  estimatedDeliveryDate: string | null = null;
  total: number = 0;
  orderNumber: string = '';

  payment = {
    name: '',
    phone: '',
    address: '',
    method: 'cash-on-delivery',
    cardnumber: '',
    expiry: '',
    cvv: ''
  };

  constructor(
    private agentService: AgentService,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.calculateTotal();
    this.generateOrderNumber();
  }

  private generateOrderNumber(): void {
    this.orderNumber = '#' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  }

  private calculateTotal(): void {
    const cartItems = this.cartService.getToCart();
    this.total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  }

  onSubmit(paymentForm: NgForm) {
    if (this.payment.method === 'credit-card') {
      if (!this.payment.cardnumber || !this.payment.expiry || !this.payment.cvv) {
        this.toast.error('Please enter all card details');
        return;
      }
    }

    if (paymentForm.invalid) {
      paymentForm.control.markAllAsTouched();
      return;
    }

    this.processing = true;
    const user = this.authService.getCurrentUser();
    const cartItems = this.cartService.getToCart();

    // Build the order object to persist
    const orderItems = cartItems.map(item => ({
      productId: item.product.id || '',
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      price: item.product.price,
      quantity: item.quantity
    }));

    this.calculateDeliveryDate();

    setTimeout(() => {
      if (user) {
        this.orderService.placeOrder({
          userId: user.uid,
          userEmail: user.email || '',
          items: orderItems,
          total: this.total,
          status: 'confirmed',
          paymentMethod: this.payment.method,
          deliveryAddress: this.payment.address,
          orderNumber: this.orderNumber,
          estimatedDelivery: this.estimatedDeliveryDate || ''
        }).then(() => {
          this.cartService.clearCart();
          this.processing = false;
          this.paymentSuccess = true;
        }).catch(() => {
          this.processing = false;
          this.toast.error('Failed to place order. Please try again.');
        });
      } else {
        this.processing = false;
        this.paymentSuccess = true; // still show for guest
      }
    }, 2000);
  }

  calculateDeliveryDate() {
    const deliveryDays = Math.floor(Math.random() * 6) + 3;
    const today = new Date();
    const deliveryDay = new Date(today.setDate(today.getDate() + deliveryDays));
    this.estimatedDeliveryDate = deliveryDay.toDateString();
  }
}
