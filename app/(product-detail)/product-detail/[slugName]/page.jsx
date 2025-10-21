export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/name/${params.slugName}`, {
    cache: 'no-store',
  });

  let product = null;
  if (res.ok) {
    product = await res.json();
  }

  const productName = product?.meta_title || 'Product';
  const productDesc = product?.meta_description || 'This is my product page.';
  const productImage = product.ProductImage[0]?.url || '/default-image.png';
  const siteName = 'Qist Market';
  const baseUrl = 'https://qistmarket.pk';
  const productUrl = `${baseUrl}/product-detail/${params.slugName}`;
  const productKeywords = product?.meta_keywords;

  return {
    title: `${productName} | ${siteName}`,
    description: productDesc,
    keywords: productKeywords,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: productUrl,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${productName} | ${siteName}`,
      description: productDesc,
      url: productUrl,
      siteName: siteName,
      images: [
        {
          url: productImage,
          width: 800,
          height: 600,
          alt: productName,
        },
      ],
      locale: 'en_PK',
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

import ProductDetailClient from './ProductDetailClient';

export default function ProductDetailPage({ params }) {
  return <ProductDetailClient slugName={params.slugName} />;
}
