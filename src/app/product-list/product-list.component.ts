import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../_models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentService } from '../service/agent.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  loading: boolean = true;


  constructor(
    private router: Router,
    private agentService: AgentService,
    private productservice: ProductService
  ) { }

  ngOnInit(): void {
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
    this.router.navigate([`/product/${id}`])
  }

  ionViewDidEnter() {
    this.agentService.logAnalyticsEvent('screen_view', {
      screen_id: 'app-product-list',
      screen_class: 'ProductListComponent',
      screen_type: 'Page'
    })
  }


}
