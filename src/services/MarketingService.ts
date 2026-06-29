import axiosClient from "../api/axiosClient";
import type {
  BannerRequest,
  HomepageData,
  MarketingBanner,
  SectionSetting,
  SectionSettingRequest,
} from "../types/marketing";

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const MarketingService = {
  // Public
  getHomepageData: async (): Promise<HomepageData> => {
    const res = await axiosClient.get("/marketing/homepage");
    return res.data.data;
  },

  // Admin banners
  getAllBanners: async (page = 0, size = 50): Promise<PageResponse<MarketingBanner>> => {
    const res = await axiosClient.get(`/admin/marketing/banners?page=${page}&size=${size}`);
    return res.data.data;
  },

  getBannerById: async (id: number): Promise<MarketingBanner> => {
    const res = await axiosClient.get(`/admin/marketing/banners/${id}`);
    return res.data.data;
  },

  createBanner: async (request: BannerRequest): Promise<MarketingBanner> => {
    const res = await axiosClient.post("/admin/marketing/banners", request);
    return res.data.data;
  },

  updateBanner: async (id: number, request: BannerRequest): Promise<MarketingBanner> => {
    const res = await axiosClient.put(`/admin/marketing/banners/${id}`, request);
    return res.data.data;
  },

  deleteBanner: async (id: number): Promise<void> => {
    await axiosClient.delete(`/admin/marketing/banners/${id}`);
  },

  toggleBannerActive: async (id: number): Promise<MarketingBanner> => {
    const res = await axiosClient.put(`/admin/marketing/banners/${id}/active`);
    return res.data.data;
  },

  // Admin sections
  getAllSections: async (): Promise<SectionSetting[]> => {
    const res = await axiosClient.get("/admin/marketing/sections");
    return res.data.data;
  },

  createSection: async (request: SectionSettingRequest): Promise<SectionSetting> => {
    const res = await axiosClient.post("/admin/marketing/sections", request);
    return res.data.data;
  },

  updateSection: async (id: number, request: SectionSettingRequest): Promise<SectionSetting> => {
    const res = await axiosClient.put(`/admin/marketing/sections/${id}`, request);
    return res.data.data;
  },
};

export default MarketingService;
