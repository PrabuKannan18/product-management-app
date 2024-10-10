import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CartService } from './_service/cart.service';
import { AuthService } from './service/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent,RouterLink,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Product Management App';
  cartItemCount: number = 0;
  user: any = null;
  loginForm: any;
 

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router:Router
  ) {
  
    this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }); 
  }

  
  // Logout method
logout() {
  this.authService.logout().then(() => {
    localStorage.removeItem('user');
  });
}

      
}
