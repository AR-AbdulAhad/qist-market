import { redirect } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';

export async function generateMetadata({ params }) {
  const { slugName } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/slug/${slugName}`, {
    cache: 'no-store',
  });

  let blogs = null;
  if (res.ok) {
    blogs = await res.json();
  }

  const blogName = blogs?.metaTitle || 'Blog';
  const blogDesc = blogs?.metaDescription || 'This is my blog page.';
  const blogImage = blogs?.thumbnailUrl || '/default-image.png';
  const siteName = 'Qist Market';
  const baseUrl = 'https://www.qistmarket.pk';
  const blogUrl = `${baseUrl}/blogs/${slugName}`;
  const blogKeywords = blogs?.metaKeywords;

  return {
    title: `${blogName}`,
    description: blogDesc,
    keywords: blogKeywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: blogUrl,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${blogName}`,
      description: blogDesc,
      url: blogUrl,
      siteName,
      images: [
        {
          url: blogImage,
          width: 800,
          height: 600,
          alt: blogName,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${blogName}`,
      description: blogDesc,
      images: [blogImage],
      creator: '@qistmarket',
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slugName } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs/slug/${slugName}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    redirect('/not-found');
  }

  const blogs = await res.json();

  if (!blogs || blogs.isActive === false) {
    redirect('/not-found');
  }

  return <BlogDetailClient slugName={slugName} />;
}