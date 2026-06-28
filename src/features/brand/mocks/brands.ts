import type { Brand } from "../types/brand";

// Mock brands keep the feature usable before backend integration.
export const mockBrands: Brand[] = [
  {
    id: 1,
    name: "SS Ton",
    slug: "ss-ton",
    description: "Popular bats and protective cricket gear.",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 2,
    name: "SG",
    slug: "sg",
    description: "Match balls, bats, gloves, and pads.",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 3,
    name: "MRF",
    slug: "mrf",
    description: "Premium cricket bats for serious players.",
    isActive: false,
    displayOrder: 3,
  },
];
