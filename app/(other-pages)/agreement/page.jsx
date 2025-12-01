import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import React from "react";
import Link from "next/link";
import Agreement from "@/components/otherPages/agreement/Agreement";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const siteName = 'Qist Market';
const baseUrl = 'https://www.qistmarket.pk';

export async function generateMetadata() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/meta/agreement`, { cache: 'no-store' });
    const meta = await res.json();

    if (!res.ok || !meta) {
      return {
        title: 'Agreement - Qist Market',
        description: 'Qist Market Agreement Page.',
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
        canonical: `${baseUrl}/agreement`,
      },
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: `${meta.metaTitle} | ${siteName}`,
        description: meta.metaDescription,
        siteName: siteName,
        locale: 'en_GB',
        type: 'website',
        url: `${baseUrl}/agreement`,
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
      title: 'Agreement - Qist Market',
      description: 'Qist Market Agreement Page.',
      robots: { index: true, follow: true, },
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
              <span className="body-small">Agreement</span>
            </li>
          </ul>
        </div>
      </div>
      <Agreement />
      <Features />
      <Footer1 />
    </>
  );
}
