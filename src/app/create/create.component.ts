import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { AgentService } from '../service/agent.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  loading: Boolean = false;

  model = {
    email: '',
    password: '',
    cpassword: '',
  }

  constructor(
    private authService: AuthService,
    private agentService: AgentService // Inject the AgentService
  ) { }

  onSubmit(contactForm: NgForm) {
    if (contactForm.invalid) {
      contactForm.form.markAllAsTouched();
      return;
    }

    if (contactForm.valid && this.model.password === this.model.cpassword) {
      this.authService.signUp(this.model.email, this.model.password);
      this.loading = true;
    } else {
      alert('Passwords do not match');
      this.loading = false;
    }
  }

  ionViewDidEnter() {
    this.agentService.logAnalyticsEvent('screen_view', {
      screen_id: 'app-create',
      screen_class: 'CreateComponent',
      screen_type: 'Page'
    })
  }
}
