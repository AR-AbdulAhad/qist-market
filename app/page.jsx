import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar1 from "@/components/headers/Topbar1";
import Features from "@/components/common/Features";
import Hero from "@/components/homes/home-1/Hero";
import Products1 from "@/components/homes/home-1/Products1";
import NewProducts from "@/components/common/NewProducts";
import TopCategoryProducts from "@/components/homes/home-1/TopCategoryProducts";
import TopCategories from "@/components/common/TopCategories";

const siteName = "Qist Market";
const siteDescription =
  "Qist Market is Pakistan’s leading online installment shopping platform. Buy mobiles, electronics, home appliances, and more on easy installments. Shop smart, shop Qist Market!";
const siteKeywords =
  "Qist Market, Installment Shopping, Online Shopping Pakistan, Mobile Installments, Electronics, Easy Installments, Home Appliances";
const siteUrl = "https://qistmarket.pk";
const siteImage = `${siteUrl}/images/banner/qist-market-banner.jpg`;

export const metadata = {
  title: `${siteName} - Home`,
  description: siteDescription,
  keywords: siteKeywords,
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: `${siteName} - Online Installment Shopping`,
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [siteImage],
    creator: "@qistmarket",
  },
};

export default function Home() {
  return (
    <>
      <Topbar1 />
      <Header1 />
      <Hero />
      <Features />
      <TopCategories />
      <Products1 />
      <TopCategoryProducts />
      <NewProducts />
      <Footer1 />
    </>
  );
}
