import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/name/${params.subCategorySlug}`,
    {
      cache: 'no-store',
    }
  );

  let subcategory = null;
  if (res.ok) {
    subcategory = await res.json();
  }

  // Format slugs for fallback
  const formatSlugName = (slug) => {
    if (!slug) return '';
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categoryName = formatSlugName(params.categorySlug) || 'Category';
  const subcategoryName = subcategory?.meta_title || formatSlugName(params.categorySlug) || 'Category'; formatSlugName(params.subCategorySlug) || 'Subcategory';
  const subcategoryDesc =
    subcategory?.meta_description ||
    `Browse ${categoryName} ${subcategoryName} at the best prices in Pakistan`;
  const subcategoryKeywords = subcategory?.meta_keywords || null;
  const siteName = 'Qist Market';
  const baseUrl = 'https://www.qistmarket.pk';
  const subcategoryUrl = `${baseUrl}/category/${params.categorySlug}/${params.subCategorySlug}`;

  return {
    title: `${subcategoryName} | ${siteName}`,
    description: subcategoryDesc,
    keywords: subcategoryKeywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: subcategoryUrl,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${subcategoryName} | ${siteName}`,
      description: subcategoryDesc,
      url: subcategoryUrl,
      siteName: siteName,
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${subcategoryName} | ${siteName}`,
      description: subcategoryDesc,
      creator: '@qistmarket',
    },
  };
}

import SubCategoryClient from './SubCategoryClient';

export default async function SubCategoryPage({ params }) {

  let product = null;
    
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/name/${params.subCategorySlug}`, {
          cache: 'no-store',
        });
    
        if (!res.ok) {
          redirect('/not-found');
        }
    
        product = await res.json();
    
        if (!product || product.isDeleted || product.isActive === false) {
          redirect('/not-found');
        }
      } catch (error) {
        console.error('Product fetch failed:', error);
        redirect('/not-found');
      }
  return <SubCategoryClient categorySlug={params.categorySlug} subCategorySlug={params.subCategorySlug} />;
}