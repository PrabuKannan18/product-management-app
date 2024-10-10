import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CartComponent } from './cart/cart.component';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { CreateComponent } from './create/create.component';
import { authGuard } from './auth.guard';
import { PaymentComponent } from './payment/payment.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent,canActivate:[authGuard]  },  
  { path: 'add-product', component: AddProductComponent, canActivate:[authGuard]  },  
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent, canActivate:[authGuard] }, 
  { path: 'user-auth', component: UserAuthComponent },
  { path: 'create', component: CreateComponent },
  {path: 'payment',component:PaymentComponent}
];
