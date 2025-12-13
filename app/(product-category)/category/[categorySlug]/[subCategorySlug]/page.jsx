import { redirect } from 'next/navigation';
import SubCategoryClient from './SubCategoryClient';

export async function generateMetadata({ params }) {
  const { categorySlug, subCategorySlug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/name/${subCategorySlug}`,
    { cache: 'no-store' }
  );

  let subcategory = null;
  if (res.ok) {
    subcategory = await res.json();
  }

  // Helper to format slug into readable name
  const formatSlugName = (slug) => {
    if (!slug) return '';
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedCategory = formatSlugName(categorySlug);
  const formattedSubCategory = formatSlugName(subCategorySlug);

  const subcategoryName = subcategory?.meta_title || formattedSubCategory || 'Subcategory';
  const categoryName = formattedCategory || 'Category';

  const subcategoryDesc =
    subcategory?.meta_description ||
    `Browse ${subcategoryName} in ${categoryName} at the best prices in Pakistan`;

  const subcategoryKeywords = subcategory?.meta_keywords || null;
  const siteName = 'Qist Market';
  const baseUrl = 'https://www.qistmarket.pk';
  const subcategoryUrl = `${baseUrl}/category/${categorySlug}/${subCategorySlug}`;

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
      siteName,
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

export default async function SubCategoryPage({ params }) {
  const { categorySlug, subCategorySlug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/name/${subCategorySlug}`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    redirect('/not-found');
  }

  const subcategory = await res.json();
  if (!subcategory || subcategory.isDeleted || subcategory.isActive === false) {
    redirect('/not-found');
  }

  return (
    <SubCategoryClient
      categorySlug={categorySlug}
      subCategorySlug={subCategorySlug}
    />
  );
}