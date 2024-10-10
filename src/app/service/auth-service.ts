import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, user } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { onAuthStateChanged, sendPasswordResetEmail, User } from 'firebase/auth';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private userSubject: BehaviorSubject<any>;
    user$: Observable<any>;

    constructor(private auth: Auth,private router: Router, private route: ActivatedRoute) {

        this.userSubject = new BehaviorSubject(null);
        this.user$ = this.userSubject.asObservable();


        onAuthStateChanged(this.auth, (user) => {
            this.userSubject.next(user);
        });
    }



    signUp(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password)
            .then(res => {
                alert('Welcome To GadgetHub')
                this.router.navigate(['']);
            })
            .catch(error => {
                console.error('Error during sign up:', error);
            });
    }



    login(userForm: FormGroup,) {
        const email = userForm.get('email')?.value;
        const password = userForm.get('password')?.value;


        return signInWithEmailAndPassword(this.auth, email, password)
            .then(res => {
                alert('Welcome To GadgetHub')
                this.router.navigate(['']);
            })

    }
    
    passwordReset(email:string){
        return sendPasswordResetEmail(this.auth,email)
 }

    // Logout method
    logout() {
        return signOut(this.auth).then(() => {
            alert('Log out successfully')
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


