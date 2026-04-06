import { ProductAvailability, ProductCategory } from '../types';

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.Bracelets]: 'Vòng tay',
  [ProductCategory.Necklaces]: 'Vòng cổ',
  [ProductCategory.Pendants]: 'Mặt dây',
  [ProductCategory.Earrings]: 'Bông tai',
  [ProductCategory.Rings]: 'Nhẫn',
  [ProductCategory.Sets]: 'Bộ trang sức',
  [ProductCategory.Watches]: 'Đồng hồ',
  [ProductCategory.Others]: 'Khác',
  [ProductCategory.Blog]: 'Blog',
};

export const PRODUCT_AVAILABILITY_LABELS: Record<ProductAvailability, string> = {
  [ProductAvailability.Available]: 'Còn hàng',
  [ProductAvailability.SoldOut]: 'Hết hàng',
};

export const PRODUCT_CATEGORY_OPTIONS = Object.values(ProductCategory).filter(
  (category) => category !== ProductCategory.Blog,
);

export const getLocalizedProductCategory = (category: string) => {
  return PRODUCT_CATEGORY_LABELS[category as ProductCategory] || category;
};

export const getLocalizedProductAvailability = (availability: string) => {
  return PRODUCT_AVAILABILITY_LABELS[availability as ProductAvailability] || availability;
};