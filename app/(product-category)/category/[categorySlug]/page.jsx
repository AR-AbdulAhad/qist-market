import { redirect } from 'next/navigation';
import CategoryClient from './CategoryClient';

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/name/${categorySlug}`, {
    cache: 'no-store',
  });

  let category = null;
  if (res.ok) {
    category = await res.json();
  }

  const fallbackName = categorySlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const categoryName = category?.meta_title || fallbackName || 'Category';
  const categoryDesc = category?.meta_description || `Browse ${categoryName} at the best prices in Pakistan`;
  const categoryKeywords = category?.meta_keywords || null;
  const siteName = 'Qist Market';
  const baseUrl = 'https://www.qistmarket.pk';
  const categoryUrl = `${baseUrl}/category/${categorySlug}`;

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
      siteName,
      locale: 'en_GB',
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

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/name/${categorySlug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    redirect('/not-found');
  }

  const category = await res.json();

  if (!category || category.isDeleted || category.isActive === false) {
    redirect('/not-found');
  }

  return <CategoryClient categorySlug={categorySlug} />;
}