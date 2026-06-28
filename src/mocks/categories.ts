import type { Category } from "../types/category";

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Cricket Bats",
    slug: "cricket-bats",
    description: "English willow and Kashmir willow bats",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 2,
    name: "Cricket Balls",
    slug: "cricket-balls",
    description: "Leather balls, tennis balls, and training balls",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 3,
    name: "Protective Gear",
    slug: "protective-gear",
    description: "Pads, gloves, helmets, guards",
    isActive: true,
    displayOrder: 3,
  },
];