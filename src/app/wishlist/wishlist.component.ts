import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { WishlistService } from '../service/wishlist.service';
import { ProductService } from '../product.service';
import { CartService } from '../_service/cart.service';
import { AuthService } from '../service/auth-service';
import { ToastService } from '../service/toast.service';
import { Product } from '../_models/product';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load all products then filter by wishlist IDs
    this.productService.getProducts().subscribe(all => {
      const ids = this.wishlistService.getWishlistedIds();
      this.products = all.filter(p => p.id && ids.includes(p.id));
      this.loading = false;
    });

    // Re-filter when wishlist changes
    this.wishlistService.wishlistIds.subscribe(ids => {
      this.productService.getProducts().subscribe(all => {
        this.products = all.filter(p => p.id && ids.includes(p.id));
      });
    });
  }

  removeFromWishlist(product: Product) {
    this.wishlistService.toggleWishlist(product.id!).then(() => {
      this.toast.info(`"${product.name}" removed from wishlist`);
    });
  }

  addToCart(event: Event, product: Product) {
    event.stopPropagation();
    const user = this.authService.getCurrentUser();
    if (!user) { this.router.navigate(['/user-auth']); return; }
    this.cartService.addToCart(product, 1);
    this.toast.success(`"${product.name}" added to cart!`);
  }
}
