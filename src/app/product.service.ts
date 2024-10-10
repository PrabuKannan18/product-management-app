import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { Product } from './_models/product';
import { collection, CollectionReference, deleteDoc, doc, Firestore, getDoc, getDocs, query, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private collectionRef: CollectionReference;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.collectionRef = collection(this.firestore, 'products');
  }

  getProducts(): Observable<Product[]> {
    const q = query(this.collectionRef);
    return from(getDocs(q).then(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Product)));
  }

  addProduct(product: Product): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      const id = doc(this.collectionRef).id;
      return setDoc(doc(this.firestore, `products/${id}`), {
        ...product,
        id,
        addedBy: user.displayName || user.email
      });
    }
    return Promise.reject('User not logged in');
  }

  getProductById(id: string): Observable<Product | undefined> {
    const docRef = doc(this.firestore, `products/${id}`);
    return from(getDoc(docRef).then(doc => doc.exists() ? { ...doc.data(), id } as Product : undefined));
  }

  deleteProduct(id: string): Promise<void> {
    const docRef = doc(this.firestore, `products/${id}`);
    return deleteDoc(docRef);
  }
}
