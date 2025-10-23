// app/pages/[categories_SlugName]/page.jsx
import Link from 'next/link';
import Header4 from "@/components/headers/Header4";
import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import { notFound } from 'next/navigation';
import DynamicPagesComp from '@/components/otherPages/DynamicPagesComp';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function generateMetadata({ params }) {
  const { categories_SlugName } = params;
  const siteName = 'Qist Market';
  const baseUrl = 'https://qistmarket.pk';

  try {
    const res = await fetch(`${BACKEND_URL}/api/pages/${categories_SlugName}`, { cache: 'no-store' });
    const page = await res.json();

    if (!res.ok || !page || !page.isActive) {
      return {
        title: 'Page Not Found - Qist Market',
        robots: 'noindex, nofollow',
      };
    }

    return {
      title: `${page.metaTitle} | ${siteName}`,
      description: page.metaDescription,
      keywords: page.metaKeywords,
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `${baseUrl}/pages/${categories_SlugName}`,
      },
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: `${page.metaTitle} | ${siteName}`,
        description: page.metaDescription,
        siteName: siteName,
        locale: 'en_PK',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${page.metaTitle} | ${siteName}`,
        description: page.metaDescription,
        creator: '@qistmarket',
      },
    };
  } catch (error) {
    console.error('Error fetching page metadata:', error);
    return {
      title: 'Page Not Found - Qist Market',
      robots: 'noindex, nofollow',
    };
  }
}

export default async function DynamicPage({ params }) {
  const { categories_SlugName } = params;

  let page;
  try {
    const res = await fetch(`${BACKEND_URL}/api/pages/${categories_SlugName}`, { cache: 'no-store' });
    page = await res.json();

    if (!res.ok || !page || !page.isActive) {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching page:', error);
    notFound();
  }

  return (
    <>
      <Header4 />
      <div className="tf-sp-3 pb-0">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href="/" className="body-small link">
                Home
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">{page.title}</span>
            </li>
          </ul>
        </div>
      </div>
      <DynamicPagesComp page={page} />
      <Features />
      <Footer1 />
    </>
  );
}