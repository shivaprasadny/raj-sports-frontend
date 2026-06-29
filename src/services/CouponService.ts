import axiosClient from "../api/axiosClient";
import type { Coupon, CouponRequest, CouponValidationResponse } from "../types/coupon";

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const CouponService = {
  // Admin CRUD
  getAllCoupons: async (page = 0, size = 25): Promise<PageResponse<Coupon>> => {
    const res = await axiosClient.get(`/admin/coupons?page=${page}&size=${size}`);
    return res.data.data;
  },

  getCouponById: async (id: number): Promise<Coupon> => {
    const res = await axiosClient.get(`/admin/coupons/${id}`);
    return res.data.data;
  },

  createCoupon: async (request: CouponRequest): Promise<Coupon> => {
    const res = await axiosClient.post("/admin/coupons", request);
    return res.data.data;
  },

  updateCoupon: async (id: number, request: CouponRequest): Promise<Coupon> => {
    const res = await axiosClient.put(`/admin/coupons/${id}`, request);
    return res.data.data;
  },

  deleteCoupon: async (id: number): Promise<void> => {
    await axiosClient.delete(`/admin/coupons/${id}`);
  },

  // Cart validation
  applyCoupon: async (
    code: string,
    orderSubtotal: number
  ): Promise<CouponValidationResponse> => {
    const res = await axiosClient.post("/cart/apply-coupon", {
      code,
      orderSubtotal,
    });
    return res.data.data;
  },

  removeCoupon: async (): Promise<void> => {
    await axiosClient.delete("/cart/remove-coupon");
  },
};

export default CouponService;
