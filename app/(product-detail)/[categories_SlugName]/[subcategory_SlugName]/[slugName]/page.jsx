import { redirect } from 'next/navigation';
import { fetchProduct } from '@/lib/fetchProduct';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  let product;
  try {
    product = await fetchProduct(params.slugName);
  } catch (error) {
    return {
      title: 'Product Not Found | Qist Market',
      description: 'This product is not available.',
      robots: { index: false, follow: false },
    };
  }

  const productName = product?.meta_title || 'Product';
  const productDesc = product?.meta_description || 'This is my product page.';
  const productImage = product.ProductImage?.[0]?.url || '/images/product-placeholder/product-placeholder-image.png';
  const baseUrl = 'https://www.qistmarket.pk';
  const productUrl = `${baseUrl}/${product?.category_slug_name}/${product?.subcategory_slug_name}/${params.slugName}`;

  return {
    title: `${productName} | Qist Market`,
    description: productDesc,
    keywords: product?.meta_keywords,
    robots: { index: true, follow: true },
    alternates: { canonical: productUrl },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${productName} | Qist Market`,
      description: productDesc,
      url: productUrl,
      siteName: 'Qist Market',
      images: [{ url: productImage, width: 800, height: 600, alt: productName }],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} | Qist Market`,
      description: productDesc,
      images: [productImage],
      creator: '@qistmarket',
    },
  };
}

export default async function ProductDetailPage({ params }) {
  let product;
  try {
    product = await fetchProduct(params.slugName);
  } catch (error) {
    redirect('/not-found');
  }

  return <ProductDetailClient product={product} slugName={params.slugName} />;
}