import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from '@angular/fire/firestore';
import { Review } from '../_models/review';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private firestore: Firestore) {}

  addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<void> {
    const ref = collection(this.firestore, 'reviews');
    return addDoc(ref, { ...review, createdAt: serverTimestamp() }).then(() => {});
  }

  getProductReviews(productId: string): Observable<Review[]> {
    const ref = collection(this.firestore, 'reviews');
    const q = query(ref, where('productId', '==', productId), orderBy('createdAt', 'desc'));
    return from(getDocs(q).then(snap =>
      snap.docs.map(d => ({ ...d.data(), id: d.id } as Review))
    ));
  }

  getAverageRating(reviews: Review[]): number {
    if (!reviews.length) return 0;
    return parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));
  }

  hasUserReviewed(reviews: Review[], userId: string): boolean {
    return reviews.some(r => r.userId === userId);
  }
}
