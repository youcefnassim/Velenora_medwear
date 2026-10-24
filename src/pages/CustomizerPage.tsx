import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomizerStudio } from '../features/configurator/components/CustomizerStudio';
import { useProducts, DEFAULT_FALLBACK_PRODUCT } from '../features/catalog/productStore';

export const CustomizerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const { products } = useProducts();

  const baseProduct = products.find((p) => p.id === productId || p.slug === productId) || products[0] || DEFAULT_FALLBACK_PRODUCT;

  return <CustomizerStudio baseProduct={baseProduct} />;
};

