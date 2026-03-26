import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_models/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../_service/cart.service';
import { AuthService } from '../service/auth-service';
import { AgentService } from '../service/agent.service';
import { WishlistService } from '../service/wishlist.service';
import { ReviewService } from '../service/review.service';
import { ToastService } from '../service/toast.service';
import { Review } from '../_models/review';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  loading = true;
  product: Product | undefined;
  currentUser: any;

  // Wishlist
  isWishlisted = false;
  wishlistLoading = false;

  // Reviews
  reviews: Review[] = [];
  averageRating = 0;
  reviewsLoading = true;
  showReviewForm = false;
  newRating = 5;
  newComment = '';
  submittingReview = false;
  hoverRating = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartservice: CartService,
    private authService: AuthService,
    private agentService: AgentService,
    private wishlistService: WishlistService,
    private reviewService: ReviewService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.currentUser = this.authService.getCurrentUser();

    this.productService.getProductById(id).subscribe(product => {
      this.product = product;
      this.loading = false;
      if (product?.id) {
        this.isWishlisted = this.wishlistService.isWishlisted(product.id);
        this.loadReviews(product.id);
      }
    });

    // sync wishlist state
    this.wishlistService.wishlistIds.subscribe(() => {
      if (this.product?.id) {
        this.isWishlisted = this.wishlistService.isWishlisted(this.product.id);
      }
    });
  }

  loadReviews(productId: string) {
    this.reviewsLoading = true;
    this.reviewService.getProductReviews(productId).subscribe(reviews => {
      this.reviews = reviews;
      this.averageRating = this.reviewService.getAverageRating(reviews);
      this.reviewsLoading = false;
    });
  }

  addToCart() {
    if (this.product) {
      this.cartservice.addToCart(this.product, 1);
      this.toast.success(`"${this.product.name}" added to cart!`);
    }
  }

  async toggleWishlist() {
    if (!this.currentUser) {
      this.toast.warning('Please log in to save to wishlist');
      this.router.navigate(['/user-auth']);
      return;
    }
    this.wishlistLoading = true;
    const added = await this.wishlistService.toggleWishlist(this.product!.id!);
    this.isWishlisted = added;
    this.toast[added ? 'success' : 'info'](
      added ? `"${this.product!.name}" saved to wishlist ❤️` : `Removed from wishlist`
    );
    this.wishlistLoading = false;
  }

  deleteProduct() {
    if (this.product && this.currentUser) {
      if (this.isOwnProduct()) {
        if (confirm('Are you sure you want to delete this product?')) {
          this.productService.deleteProduct(this.product.id!)
            .then(() => {
              this.toast.success('Product deleted successfully');
              this.router.navigate(['/products']);
            });
        }
      }
    }
  }

  isOwnProduct(): boolean {
    if (!this.product || !this.currentUser) return false;
    return this.product.addedBy === this.currentUser.email;
  }

  hasUserReviewed(): boolean {
    if (!this.currentUser) return false;
    return this.reviewService.hasUserReviewed(this.reviews, this.currentUser.uid);
  }

  async submitReview() {
    if (!this.currentUser) {
      this.toast.warning('Please log in to leave a review');
      return;
    }
    if (!this.newComment.trim()) {
      this.toast.error('Please write a comment before submitting');
      return;
    }
    this.submittingReview = true;
    await this.reviewService.addReview({
      productId: this.product!.id!,
      userId: this.currentUser.uid,
      userEmail: this.currentUser.email,
      rating: this.newRating,
      comment: this.newComment.trim()
    });
    this.toast.success('Review submitted! Thank you 🙌');
    this.newComment = '';
    this.newRating = 5;
    this.showReviewForm = false;
    this.submittingReview = false;
    this.loadReviews(this.product!.id!);
  }

  setRating(rating: number) { this.newRating = rating; }
  setHover(rating: number) { this.hoverRating = rating; }
  clearHover() { this.hoverRating = 0; }
  getRatingStars(rating: number): number[] { return Array(5).fill(0).map((_, i) => i + 1); }
}
