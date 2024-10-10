import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../service/auth-service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.scss'
})
export class UserAuthComponent {

  loading:boolean = false;
       
  userForm = new FormGroup({
         email: new FormControl('',Validators.required),
         password:new FormControl('',Validators.required)
  })

  constructor(
    private authService:AuthService
  ){}
  
  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
  
    if (this.userForm.valid) {
      this.loading = true;
      this.authService.login(this.userForm).then(() => {
        localStorage.setItem('user', JSON.stringify(this.userForm.value))
        this.loading = false; 
      }).catch((error) => {
        this.loading = false; 
        alert('Please create an account to log in.');
      });
    }
  }

  passwordReset() {
    const email = this.userForm.value.email
    if (!email) {
      alert('Please enter your email address to reset your password.')
    } else {
      this.loading=true;
      this.authService.passwordReset(email).then(()=>{
        this.loading=false;
        alert('Password reset email sent! Please check your inbox.')
      })
     
    }
  }

  signInWithGoogle() {
    this.authService.googleSignIn();
  }
}
