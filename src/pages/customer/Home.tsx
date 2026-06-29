import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import toast from "react-hot-toast";
import AdvertisementBanner from "../../features/home/components/AdvertisementBanner";
import BestSellersSection from "../../features/home/components/BestSellersSection";
import CategorySection from "../../features/home/components/CategorySection";
import FeaturedProductsSection from "../../features/home/components/FeaturedProductsSection";
import HeroSection from "../../features/home/components/HeroSection";
import NewArrivalsSection from "../../features/home/components/NewArrivalsSection";
import NewsletterSection from "../../features/home/components/NewsletterSection";
import ReviewsSection from "../../features/home/components/ReviewsSection";
import ShopByBrandSection from "../../features/home/components/ShopByBrandSection";
import SpecialOffersSection from "../../features/home/components/SpecialOffersSection";
import TrendingProductsSection from "../../features/home/components/TrendingProductsSection";
import { addToCart } from "../../features/cart";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { Product } from "../../features/product";
import MarketingService from "../../services/MarketingService";
import type { HomepageData } from "../../types/marketing";

// Home composes all storefront sections and hydrates them from the marketing API.
// Every section falls back to hardcoded defaults when the API has no content.
const Home = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) =>
    state.category.categories.filter((c) => c.isActive)
  );
  const products = useAppSelector((state) =>
    state.product.products.filter((p) => p.isActive)
  );

  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);

  useEffect(() => {
    MarketingService.getHomepageData()
      .then(setHomepageData)
      .catch(() => {
        // Silently fall back to defaults — homepage still renders without marketing data.
      });
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart.");
  };

  // Helper: lookup a section setting by key (controls title / subtitle overrides).
  const section = (key: string) =>
    homepageData?.sections.find((s) => s.sectionKey === key);

  // Helper: check if a section is configured to be visible (default true when no data).
  const isVisible = (key: string) => {
    const s = section(key);
    return s ? s.isVisible : true;
  };

  const ad1 = homepageData?.advertisementBanner1;
  const ad2 = homepageData?.advertisementBanner2;

  return (
    <>
      {/* ── Hero — full-width, no container constraint ─────────────── */}
      {isVisible("HERO") && <HeroSection banner={homepageData?.heroBanner} />}

      <Container maxWidth="lg">
        {/* ── Categories ──────────────────────────────────────────── */}
        {isVisible("CATEGORIES") && <CategorySection categories={categories} />}

        {/* ── Special Offers ───────────────────────────────────────── */}
        {isVisible("SPECIAL_OFFERS") && (
          <SpecialOffersSection
            banners={homepageData?.specialOffers}
            title={section("SPECIAL_OFFERS")?.sectionTitle}
            subtitle={section("SPECIAL_OFFERS")?.sectionSubtitle}
          />
        )}

        {/* ── Ad Banner #1 ─────────────────────────────────────────── */}
        {isVisible("ADVERTISEMENT_1") && (
          <AdvertisementBanner
            eyebrow={ad1 ? undefined : "SUMMER SEASON"}
            title={ad1?.title ?? "Gear Up for the Season"}
            subtitle={ad1?.subtitle ?? "Shop premium cricket equipment at unbeatable prices"}
            buttonText={ad1?.buttonText ?? "Explore Products"}
            buttonHref={ad1?.buttonLink ?? "/products"}
            background={
              ad1?.imageUrl
                ? `url(${ad1.imageUrl})`
                : "linear-gradient(90deg, #1565C0 0%, #0D47A1 100%)"
            }
          />
        )}

        {/* ── Featured Products ─────────────────────────────────────── */}
        {isVisible("FEATURED_PRODUCTS") && (
          <FeaturedProductsSection
            products={products.filter((p) => p.isFeatured)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* ── Shop by Brand ─────────────────────────────────────────── */}
        {isVisible("SHOP_BY_BRAND") && <ShopByBrandSection />}

        {/* ── Best Sellers ──────────────────────────────────────────── */}
        {isVisible("BEST_SELLERS") && (
          <BestSellersSection
            products={products.filter((p) => p.isBestSeller)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* ── Trending Products ─────────────────────────────────────── */}
        {isVisible("TRENDING_PRODUCTS") && <TrendingProductsSection />}

        {/* ── Ad Banner #2 ─────────────────────────────────────────── */}
        {isVisible("ADVERTISEMENT_2") && (
          <AdvertisementBanner
            eyebrow={ad2 ? undefined : "JUST ARRIVED"}
            title={ad2?.title ?? "New Arrivals — Fresh Gear for Every Player"}
            subtitle={
              ad2?.subtitle ??
              "From leather balls to high-performance bats — check what's new"
            }
            buttonText={ad2?.buttonText ?? "Shop New Arrivals"}
            buttonHref={ad2?.buttonLink ?? "/products"}
            background={
              ad2?.imageUrl
                ? `url(${ad2.imageUrl})`
                : "linear-gradient(90deg, #2E7D32 0%, #1B5E20 100%)"
            }
          />
        )}

        {/* ── New Arrivals ───────────────────────────────────────────── */}
        {isVisible("NEW_ARRIVALS") && (
          <NewArrivalsSection
            products={products.filter((p) => p.isNewArrival)}
            onAddToCart={handleAddToCart}
          />
        )}

        <ReviewsSection />

        {/* ── Newsletter ────────────────────────────────────────────── */}
        {isVisible("NEWSLETTER") && (
          <NewsletterSection banner={homepageData?.newsletterBanner} />
        )}
      </Container>
    </>
  );
};

export default Home;
