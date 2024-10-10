import { Injectable } from '@angular/core';
import { Product } from '../_models/product';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: { product: Product; quantity: number }[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
 

  cartItemCount$ = this.cartItemCount.asObservable();
  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user && user.email) { 
        this.loadUserCart(user.email);  
      } else {
        this.clearCart(); 
      }
    });
  }
  

  addToCart(product: Product, quantity: number): void {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }

    this.savedCartItems();
    this.updateCartItemCount();
  }



  getToCart() {
    return this.cartItems;
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.savedCartItems();
    this.updateCartItemCount();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      }
    }

    this.savedCartItems();
    this.updateCartItemCount();
  }

  clearCart(): void {
    this.cartItems = [];
    this.savedCartItems();
    this.updateCartItemCount();
  }

  private savedCartItems() {
    const user = this.authService.getCurrentUser();
    if (user && user.email) {  // Check if the user and email exist
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(this.cartItems));  // Use email as the unique identifier
    }
    this.updateCartItemCount();
  }
  
  loadUserCart(email: string) {
    const savedCart = localStorage.getItem(`cart_${email}`);  // Retrieve cart using email
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];  // Parse if found, else set as an empty array
    this.updateCartItemCount();
  }
  

  private updateCartItemCount() {
    const totalQuantity = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    this.cartItemCount.next(totalQuantity);
  }
}
