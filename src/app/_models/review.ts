export interface Review {
  id?: string;
  productId: string;
  userId: string;
  userEmail: string;
  rating: number;    // 1-5
  comment: string;
  createdAt: any;
}
