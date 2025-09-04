
export enum ProductCategory {
  Bracelets = 'Bracelets',
  Necklaces = 'Necklaces',
  Pendants = 'Pendants',
  Earrings = 'Earrings',
  Rings = 'Rings',
  Sets = 'Sets',
  Watches = 'Watches',
  Others = 'Others',
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