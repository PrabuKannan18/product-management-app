import { Injectable } from '@angular/core';
import { Analytics, setUserId } from '@angular/fire/analytics';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, user } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { onAuthStateChanged, sendPasswordResetEmail, User } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private userSubject: BehaviorSubject<any>;
    user$: Observable<any>;

    constructor(private auth: Auth, private router: Router, private route: ActivatedRoute, private analytics: Analytics, private toast: ToastService) {

        this.userSubject = new BehaviorSubject(null);
        this.user$ = this.userSubject.asObservable();


        onAuthStateChanged(this.auth, (user) => {
            this.userSubject.next(user);
            if (user) {
                setUserId(this.analytics, user.uid);
                console.log('User is signed in:', user.uid);
            }
        });

    }



    signUp(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password)
            .then(res => {
                this.toast.success('Welcome to GadgetHub! 🎉');
                this.router.navigate(['']);
            })
            .catch(error => {
                this.toast.error(error.message || 'Sign up failed. Try again.');
            });
    }



    login(userForm: FormGroup,) {
        const email = userForm.get('email')?.value;
        const password = userForm.get('password')?.value;


        return signInWithEmailAndPassword(this.auth, email, password)
            .then(res => {
                this.toast.success(`Welcome back, ${res.user.email?.split('@')[0]}! 👋`);
                this.router.navigate(['']);
            })
            .catch((error) => {
                this.toast.error('Invalid email or password. Please try again.');
            });
    }

    passwordReset(email: string) {
        return sendPasswordResetEmail(this.auth, email)
    }

    // Logout method
    logout() {
        return signOut(this.auth).then(() => {
            this.toast.info('You have been logged out.');
            this.router.navigate(['']);
        });
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    googleSignIn() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider)
            .then((result) => {
                this.router.navigate(['']);
            })
    }


    // signOut() {
    //     return this.auth.signOut().then(() => {
    //       this.router.navigate(['/login']);
    //     });
    //   }
}


