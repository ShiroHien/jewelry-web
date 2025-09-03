
export enum ProductCategory {
  Bracelets = 'Vòng tay',
  Necklaces = 'Vòng cổ',
  Pendants = 'Mặt dây',
  Earrings = 'Bông tai',
  Rings = 'Nhẫn',
  Sets = 'Bộ trang sức',
  Watches = 'Đồng hồ',
  Others = 'Khác',
  Blog = 'Blog'
}

export enum ProductAvailability {
  Available = 'Available',
  SoldOut = 'Sold Out',
}

export interface Product {
  _id: string;
  name: string;
  images: string[];
  briefDescription: string;
  description: string;
  details: Record<string, string>;
  category: ProductCategory;
  tags: string[];
  price: number;
  availability: ProductAvailability;
}

export interface ClassicalStyle {
  image: string;
  title: string;
  description: string;
  link: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  date: string;
  author: string;
  content: string;
  excerpt?: string; 
}