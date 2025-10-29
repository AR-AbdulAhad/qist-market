import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import OrderTraking from "@/components/shop-cart/OrderTraking";
import Link from "next/link";
import React from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const siteName = 'Qist Market';
const baseUrl = 'https://qistmarket.pk';

export async function generateMetadata() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/meta/track-your-order`, { cache: 'no-store' });
    const meta = await res.json();

    if (!res.ok || !meta) {
      return {
        title: 'Track Your Order - Qist Market',
        description: 'Qist Market Track Your Order Page.',
        robots: { index: false, follow: false },
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
        canonical: `${baseUrl}/track-your-order`,
      },
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: `${meta.metaTitle} | ${siteName}`,
        description: meta.metaDescription,
        siteName: siteName,
        locale: 'en_GB',
        type: 'website',
        url: `${baseUrl}/track-your-order`,
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
      title: 'Track Your Order - Qist Market',
      description: 'Qist Market Track Your Order Page.',
      robots: { index: false, follow: false },
    };
  }
}

export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-sp-3 pb-0">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href={`/`} className="body-small link">
                {" "}
                Home{" "}
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <p className="body-small">Track Your Order</p>
            </li>
          </ul>
        </div>
      </div>

      <OrderTraking />
      <Footer1 />
    </>
  );
}
