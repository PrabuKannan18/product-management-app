import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FormsModule, NgForm } from '@angular/forms';
import { Product } from '../_models/product';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { user } from '@angular/fire/auth';
import { AuthService } from '../service/auth-service';
import { AgentService } from '../service/agent.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  product: Product = { name: '', price: 0, description: '', quantity: 0, imageUrl: '' };

  constructor(
    private router: Router,
    private productservice: ProductService,
    private authService: AuthService,
    private agentService: AgentService // Inject the AgentService
  ) { }

  onBack() {
    this.router.navigate(['']);
  }

  onSubmit(contactform: NgForm) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.productservice.addProduct(this.product).then(() => {
        this.router.navigate(['/products']);
      })
    }
  }

  ionViewDidEnter() {
    this.agentService.logAnalyticsEvent('screen_view', {
      screen_id: 'app-add-product',
      screen_class: 'AddProductComponent',
      screen_type: 'Page'
    })
  }
}



