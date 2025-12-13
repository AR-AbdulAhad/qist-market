import { redirect } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const { slugName } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/name/${slugName}`, {
    cache: 'no-store',
  });

  let product = null;
  if (res.ok) {
    product = await res.json();
  }

  const productName = product?.meta_title || 'Product';
  const productDesc = product?.meta_description || 'This is my product page.';
  const productImage = product?.ProductImage?.[0]?.url || '/default-image.png';
  const siteName = 'Qist Market';
  const baseUrl = 'https://www.qistmarket.pk';
  const productUrl = `${baseUrl}/${product?.category_slug_name}/${product?.subcategory_slug_name}/${slugName}`;
  const productKeywords = product?.meta_keywords;

  return {
    title: `${productName} | ${siteName}`,
    description: productDesc,
    keywords: productKeywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: productUrl,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${productName} | ${siteName}`,
      description: productDesc,
      url: productUrl,
      siteName,
      images: [
        {
          url: productImage,
          width: 800,
          height: 600,
          alt: productName,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} | ${siteName}`,
      description: productDesc,
      images: [productImage],
      creator: '@qistmarket',
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slugName } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/name/${slugName}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    redirect('/not-found');
  }

  const product = await res.json();

  if (!product || product.isDeleted || product.isActive === false) {
    redirect('/not-found');
  }

  return <ProductDetailClient slugName={slugName} />;
}