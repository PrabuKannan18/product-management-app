import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth-service';
import { Product } from '../_models/product';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlistItems$ = new BehaviorSubject<string[]>([]);
  wishlistIds = this.wishlistItems$.asObservable();

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) this.loadWishlist(user.uid);
      else this.wishlistItems$.next([]);
    });
  }

  private getDocRef(userId: string) {
    return doc(this.firestore, `wishlists/${userId}`);
  }

  private async loadWishlist(userId: string) {
    const snap = await getDoc(this.getDocRef(userId));
    this.wishlistItems$.next(snap.exists() ? (snap.data()['items'] || []) : []);
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistItems$.value.includes(productId);
  }

  async toggleWishlist(productId: string): Promise<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    const ref = this.getDocRef(user.uid);
    const snap = await getDoc(ref);

    if (this.isWishlisted(productId)) {
      if (snap.exists()) {
        await updateDoc(ref, { items: arrayRemove(productId) });
      }
      this.wishlistItems$.next(this.wishlistItems$.value.filter(id => id !== productId));
      return false; // removed
    } else {
      if (snap.exists()) {
        await updateDoc(ref, { items: arrayUnion(productId) });
      } else {
        await setDoc(ref, { items: [productId] });
      }
      this.wishlistItems$.next([...this.wishlistItems$.value, productId]);
      return true; // added
    }
  }

  getWishlistedIds(): string[] {
    return this.wishlistItems$.value;
  }
}
