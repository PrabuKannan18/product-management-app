import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']  // Corrected to styleUrls
})
export class PaymentComponent {

  processing: boolean = false;
  paymentSuccess: boolean = false;
  estimatedDeliveryDate: string | null = null;

  payment = {
    name: '',
    phone: '',
    address: '',
    method: 'cash-on-delivery',
    cardnumber: '',
    expiry: '',
    cvv: ''
  };

  onSubmit(paymentForm: NgForm) {
    if (this.payment.method === 'credit-card') {
      if (!this.payment.cardnumber || !this.payment.expiry || !this.payment.cvv) {
        alert('Please enter all card details');
        return;
      }
    }

    if (paymentForm.invalid) {
      paymentForm.control.markAllAsTouched();
      return;
    }

    this.processing = true;

    setTimeout(() => {
      this.processing = false;
      this.paymentSuccess = true;
      this.calculateDeliveryDate();
    }, 2000);
  }

  calculateDeliveryDate() {
    const deliveryDays = Math.floor(Math.random() * 6) + 1;
    const today = new Date();
    const deliveryDay = new Date(today.setDate(today.getDate() + deliveryDays));
    this.estimatedDeliveryDate = deliveryDay.toDateString();
  }

}
