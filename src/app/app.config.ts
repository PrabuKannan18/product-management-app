import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ "projectId": "product-66ae3", "appId": "1:295214854214:web:64a885d5bcb9f3f50d1a47", "storageBucket": "product-66ae3.appspot.com", "apiKey": "AIzaSyCV0z2qKiqFFr_mQYhzfK3FOYnKW0uUJGo", "authDomain": "product-66ae3.firebaseapp.com", "messagingSenderId": "295214854214", "measurementId": "G-W0MV2DQVRL" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideAnalytics(() => getAnalytics()),]
};
