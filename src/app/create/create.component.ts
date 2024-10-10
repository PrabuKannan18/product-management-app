import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../service/auth-service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  loading:Boolean=false;

  model={
    email:'',
    password:'',
    cpassword:'',
  }
  
 constructor(
  private authService:AuthService
 ){}

  onSubmit(contactForm: NgForm){
      if(contactForm.invalid){
        contactForm.form.markAllAsTouched();
        return;
      }

      if (contactForm.valid && this.model.password === this.model.cpassword) {
        this.authService.signUp(this.model.email, this.model.password);
        this.loading=true;
      } else {
       alert('Passwords do not match');
       this.loading=false;
      }
  }
}
