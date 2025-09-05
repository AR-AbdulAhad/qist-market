import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar1 from "@/components/headers/Topbar1";
import Banner from "@/components/homes/home-1/Banner";
import Banner2 from "@/components/common/Banner2";
import Collections from "@/components/homes/home-1/Collections";
import Features from "@/components/common/Features";
import Hero from "@/components/homes/home-1/Hero";
import Product2 from "@/components/common/Product3";
import Products1 from "@/components/homes/home-1/Products1";
import Products3 from "@/components/homes/home-1/Products3";
import Products4 from "@/components/homes/home-1/Products4";
import Products5 from "@/components/common/Products";
import Products6 from "@/components/common/RecentProducts";

export const metadata = {
  title: "Home || Onsus - Multipurpose React Nextjs eCommerce",
  description: "Onsus - Multipurpose React Nextjs eCommerce",
};
export default function Home() {
  return (
    <>
      <Topbar1 />
      <Header1 />
      <Hero />
      <Features />
      <Products1 />
      <Product2 />
      <Products3 />
      <Collections />
      <Products4 />
      <Banner />
      <Products5 />
      <Banner2 />
      <Products6 />
      <Footer1 />
    </>
  );
}
