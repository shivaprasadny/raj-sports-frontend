export type BannerType =
  | "HERO"
  | "SPECIAL_OFFER"
  | "ADVERTISEMENT_1"
  | "ADVERTISEMENT_2"
  | "NEWSLETTER"
  | "GENERAL_PROMO";

export interface MarketingBanner {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  bannerType: BannerType;
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerRequest {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  bannerType: BannerType;
  displayOrder?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface SectionSetting {
  id: number;
  sectionKey: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  isVisible: boolean;
  displayOrder: number;
  maxItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface SectionSettingRequest {
  sectionKey: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  isVisible: boolean;
  displayOrder: number;
  maxItems: number;
}

export interface HomepageData {
  heroBanner?: MarketingBanner;
  specialOffers: MarketingBanner[];
  advertisementBanner1?: MarketingBanner;
  advertisementBanner2?: MarketingBanner;
  newsletterBanner?: MarketingBanner;
  sections: SectionSetting[];
}
