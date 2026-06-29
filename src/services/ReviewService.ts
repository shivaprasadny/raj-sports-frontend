import axiosClient from "../api/axiosClient";
import type { Review, ReviewRequest } from "../types/review";

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const ReviewService = {
  getApprovedReviews: async (
    productId: number,
    page = 0,
    size = 10
  ): Promise<PageResponse<Review>> => {
    const res = await axiosClient.get(
      `/products/${productId}/reviews?page=${page}&size=${size}`
    );
    return res.data.data;
  },

  addReview: async (productId: number, request: ReviewRequest): Promise<Review> => {
    const res = await axiosClient.post(`/products/${productId}/reviews`, request);
    return res.data.data;
  },

  // Admin
  getAllReviews: async (
    filter: "all" | "pending" = "all",
    page = 0,
    size = 20
  ): Promise<PageResponse<Review>> => {
    const res = await axiosClient.get(
      `/admin/reviews?filter=${filter}&page=${page}&size=${size}`
    );
    return res.data.data;
  },

  approveReview: async (reviewId: number): Promise<Review> => {
    const res = await axiosClient.put(`/admin/reviews/${reviewId}/approve`);
    return res.data.data;
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await axiosClient.delete(`/admin/reviews/${reviewId}`);
  },
};

export default ReviewService;
