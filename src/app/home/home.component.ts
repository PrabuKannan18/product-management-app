import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../_service/cart.service';
import { Product } from '../_models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  products: Product[] = [
    {
      id: '1',
      name: 'Noise SmartWatch',
      description: 'Smartwatch with fitness tracking',
      price: 2500,
      imageUrl: 'https://www.dhresource.com/webp/m/0x0/f2/albu/g22/M00/8C/A5/rBNaEmKy81eAe4DAAAIRpB1rlts480.jpg',
      quantity: 10
    },
    {
      id: '2',
      name: 'Wisdom Headphones',
      description: 'High-quality headphones with noise-cancellation',
      price: 2000,
      imageUrl: 'https://m.media-amazon.com/images/I/817cGC0yRvL.jpg',
      quantity: 15
    },
    {
      id: '3',
      name: 'Oppo F18',
      description: 'Latest smartphone from Oppo',
      price: 20000,
      imageUrl: 'https://www.itel-india.com/wp-content/uploads/2024/02/124-min-450x450.jpg',
      quantity: 8
    },
    {
      id: '4',
      name: 'Hauwei Watch',
      description: 'Smartwatch with a stylish design',
      price: 1000,
      imageUrl: 'https://telectronics.pk/wp-content/uploads/nc/products/redmi-smart-band-pro-pakistan-telectronics.pk2-430x430.jpg',
      quantity: 12
    }
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  addToCart(product: Product) {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.cartService.addToCart(product, 1); 
      this.router.navigate(['/cart']);
    } else {
      alert('Please log in to add items to your cart.');
      this.router.navigate(['/user-auth']);
    }
  }
}
