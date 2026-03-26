export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  deliveryAddress: string;
  orderNumber: string;
  createdAt: any;  // Firestore Timestamp
  estimatedDelivery: string;
}
