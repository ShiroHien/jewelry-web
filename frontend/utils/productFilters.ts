import { Product } from '../types';

export interface FilterCriteria {
  query: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  tags?: string[];
  availability?: string;
}

export const filterProducts = (
  products: Product[],
  criteria: FilterCriteria
): Product[] => {
  return products.filter((product) => {
    if (criteria.category &&
        product.category.toLowerCase() !== criteria.category.toLowerCase()) {
      return false;
    }

    if (criteria.maxPrice !== undefined && product.price > criteria.maxPrice) {
      return false;
    }
    if (criteria.minPrice !== undefined && product.price < criteria.minPrice) {
      return false;
    }

    if (criteria.tags && criteria.tags.length > 0) {
      const hasMatchingTag = criteria.tags.some(tag =>
        (product.tags || []).some(productTag =>
          productTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    if (criteria.availability && product.availability !== criteria.availability) {
      return false;
    }

    const searchText = criteria.query.toLowerCase();
    const matchesSearch =
      product.name?.toLowerCase().includes(searchText) ||
      product.description?.toLowerCase().includes(searchText) ||
      product.briefDescription?.toLowerCase().includes(searchText) ||
      (product.tags || []).some(tag => tag.toLowerCase().includes(searchText));

    return matchesSearch;
  });
};

export const parseSearchQuery = (query: string): FilterCriteria => {
  const lowerQuery = query.toLowerCase();
  const criteria: FilterCriteria = { query };

  const categories = ['vòng cổ', 'vòng tay', 'nhẫn', 'bông tai', 'mặt dây'];
  categories.forEach(cat => {
    if (lowerQuery.includes(cat)) {
      criteria.category = getCategoryFromVietnamese(cat);
    }
  });

  const priceMatch = lowerQuery.match(/(?:dưới|<)\s*(\d+)\s*(?:triệu|tr)/i);
  if (priceMatch) {
    criteria.maxPrice = parseInt(priceMatch[1], 10) * 1000000;
  }

  if (lowerQuery.includes('hổ phách')) {
    criteria.tags = ['amber'];
  }
  if (lowerQuery.includes('baltic')) {
    criteria.tags = [...(criteria.tags || []), 'baltic'];
  }

  return criteria;
};

const getCategoryFromVietnamese = (vietnamese: string): string => {
  const mapping: Record<string, string> = {
    'vòng cổ': 'Necklaces',
    'vòng tay': 'Bracelets',
    'nhẫn': 'Rings',
    'bông tai': 'Earrings',
    'mặt dây': 'Pendants',
  };
  return mapping[vietnamese] || '';
};