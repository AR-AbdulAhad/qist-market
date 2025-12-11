import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar1 from "@/components/headers/Topbar1";
import Features from "@/components/common/Features";
import Hero from "@/components/homes/home-1/Hero";
import Products1 from "@/components/homes/home-1/Products1";
import NewProducts from "@/components/common/NewProducts";
import TopCategoryProducts from "@/components/homes/home-1/TopCategoryProducts";
import TopCategories from "@/components/common/TopCategories";
import FeaturedProducts from "@/components/common/FeaturedProducts";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const siteName = "Qist Market";
const baseUrl = "https://www.qistmarket.pk";
const siteImage = `${baseUrl}/images/banner/qist-market-banner.jpg`;

export async function generateMetadata() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/meta/home`, { cache: 'no-store' });
    const meta = await res.json();

    if (!res.ok || !meta) {
      return {
        title: 'Qist Market - Har Chez Qist Pey',
        description: 'Online Installment Shopping in Pakistan. Buy Electronics, Appliances, Furniture, and more on easy installments.',
        robots: { index: true, follow: true },
      };
    }

    return {
      title: `${meta.metaTitle}`,
      description: meta.metaDescription,
      keywords: meta.metaKeywords,
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `${baseUrl}`,
      },
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: `${meta.metaTitle}`,
        description: meta.metaDescription,
        siteName: siteName,
        images: [
          {
            url: siteImage,
            width: 1200,
            height: 630,
            alt: `${siteName} - Online Installment Shopping`,
          },
        ],
        locale: 'en_GB',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${meta.metaTitle}`,
        description: meta.metaDescription,
        images: [siteImage],
        creator: '@qistmarket',
      },
    };
  } catch (error) {
    console.error('Error fetching shop metadata:', error);
    return {
      title: 'Qist Market - Har Chez Qist Pey',
      description: 'Online Installment Shopping in Pakistan. Buy Electronics, Appliances, Furniture, and more on easy installments.',
      robots: { index: true, follow: true },
    };
  }
}

const componentMap = {
  TopCategories,
  Products1,
  TopCategoryProducts,
  FeaturedProducts,
  NewProducts,
};

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home-sections`, {
    cache: 'no-store',
  });
  const { data: sections } = await res.json();

  const activeSections = sections
    .filter(s => s.isActive)
    .sort((a, b) => a.position - b.position);

  return (
    <>
      <Topbar1 />
      <Header1 />
      <Hero />
      <Features />

      {activeSections.map(section => {
        const Component = componentMap[section.component];
        return Component ? <Component key={section.id} /> : null;
      })}

      <Footer1 />
    </>
  );
}
