
export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/name/${params.slugName}`, {
    cache: 'no-store',
  });
  let product = null;
  if (res.ok) {
    product = await res.json();
  }

  return {
    title: `${product?.name} Price in Pakistan on Installment`|| 'loading...',
    description: product?.description || 'This is my product page',
    robots: 'noindex, nofollow',
  };
}

import ProductDetailClient from './ProductDetailClient';

export default function ProductDetailPage({ params }) {
  return <ProductDetailClient slugName={params.slugName} />;
}
