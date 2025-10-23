export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/name/${params.categorySlug}`, {
    cache: 'no-store',
  });

  let category = null;
  if (res.ok) {
    category = await res.json();
  }

  const categoryName = category?.meta_title || params.categorySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || 'Category';
  const categoryDesc = category?.meta_description || `Browse ${categoryName} at the best prices in Pakistan`;
  const categoryKeywords = category?.meta_keywords || null;
  const siteName = 'Qist Market';
  const baseUrl = 'https://qistmarket.pk';
  const categoryUrl = `${baseUrl}/category/${params.categorySlug}`;

  return {
    title: `${categoryName} | ${siteName}`,
    description: categoryDesc,
    keywords: categoryKeywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: categoryUrl,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${categoryName} | ${siteName}`,
      description: categoryDesc,
      siteName: siteName,
      locale: 'en_PK',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | ${siteName}`,
      description: categoryDesc,
      creator: '@qistmarket',
    },
  };
}

import CategoryClient from './CategoryClient';

export default function CategoryPage({ params }) {
  return <CategoryClient categorySlug={params.categorySlug} />;
}