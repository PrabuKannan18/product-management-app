import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from '@angular/fire/firestore';
import { Order } from '../_models/order';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private firestore: Firestore) {}

  placeOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    const ordersRef = collection(this.firestore, 'orders');
    return addDoc(ordersRef, { ...order, createdAt: serverTimestamp() })
      .then(ref => ref.id);
  }

  getUserOrders(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    return from(getDocs(q).then(snap =>
      snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order))
    ));
  }
}
