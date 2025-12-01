// app/pages/shop/page.jsx
import React from "react";
import Products1 from "@/components/products/Products1";
import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import Header4 from "@/components/headers/Header4";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const siteName = 'Qist Market';
const baseUrl = 'https://www.qistmarket.pk';

export async function generateMetadata() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/meta/shop`, { cache: 'no-store' });
    const meta = await res.json();

    if (!res.ok || !meta) {
      return {
        title: 'Shop - Qist Market',
        description: 'Browse our collection of products available on easy installments.',
        robots: { index: true, follow: true },
      };
    }

    return {
      title: `${meta.metaTitle} | ${siteName}`,
      description: meta.metaDescription,
      keywords: meta.metaKeywords,
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `${baseUrl}/shop`,
      },
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: `${meta.metaTitle} | ${siteName}`,
        description: meta.metaDescription,
        siteName: siteName,
        locale: 'en_GB',
        type: 'website',
        url: `${baseUrl}/shop`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${meta.metaTitle} | ${siteName}`,
        description: meta.metaDescription,
        creator: '@qistmarket',
      },
    };
  } catch (error) {
    console.error('Error fetching shop metadata:', error);
    return {
      title: 'Shop - Qist Market',
      description: 'Browse our collection of products available on easy installments.',
      robots: { index: true, follow: true },
    };
  }
}

export default function ShopPage() {
  return (
    <>
      <Header4 />
      <div className="tf-sp-1">
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
              <span className="body-small">Shop</span>
            </li>
          </ul>
        </div>
      </div>
      <Products1 />
      <Footer1 />
      <div className="overlay-filter" id="overlay-filter" />
    </>
  );
}