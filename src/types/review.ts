export interface Review {
  id: number;
  productId: number;
  productName?: string;
  userId: number;
  userName: string;
  userEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  rating: number;
  title?: string;
  comment: string;
}
