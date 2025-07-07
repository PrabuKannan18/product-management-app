import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../_models/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../_service/cart.service';
import { AuthService } from '../service/auth-service';
import { AgentService } from '../service/agent.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  loading: boolean = true;

  product: Product | undefined;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartservice: CartService,
    private authService: AuthService,
    private agentService: AgentService // Inject the AgentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe((product) => {
      this.product = product
      this.loading = false;
    });

    this.currentUser = this.authService.getCurrentUser();

  }

  addToCart() {
    if (this.product)
      this.cartservice.addToCart(this.product, 1)
    this.router.navigate(['/cart']);
  }

   ionViewDidEnter() {
    this.agentService.logAnalyticsEvent('screen_view', {
      screen_id: 'app-product-detail',
      screen_class: 'ProductDetailComponent',
      screen_type: 'Page'
    })
  }

  

  deleteProduct() {
    if (this.product && this.currentUser) {
      if (this.product.addedBy === this.currentUser.displayName || this.product.addedBy === this.currentUser.email) {
        this.productService.deleteProduct(this.product.id!)
          .then(() => {
            alert('Product deleted successfully');
            this.router.navigate(['/products']);
          })
      }
    }

  }
}
