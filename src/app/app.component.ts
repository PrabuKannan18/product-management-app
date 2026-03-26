import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

import { CartService } from './_service/cart.service';
import { AuthService } from './service/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from './toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule, ToastComponent],
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
