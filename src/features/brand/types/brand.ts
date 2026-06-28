// Brand represents a cricket equipment manufacturer shown in admin and shop filters.
export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  isActive: boolean;
  displayOrder: number;
}
