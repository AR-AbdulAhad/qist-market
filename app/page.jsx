import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar1 from "@/components/headers/Topbar1";
import Features from "@/components/common/Features";
import Hero from "@/components/homes/home-1/Hero";
import Products1 from "@/components/homes/home-1/Products1";
import NewProducts from "@/components/common/NewProducts";
import TopCategoryProducts from "@/components/homes/home-1/TopCategoryProducts";

export const metadata = {
  title: "Qist Market - Home",
  robots: "noindex, nofollow",
};

export default function Home() {
  return (
    <>
      <Topbar1 />
      <Header1 />
      <Hero />
      <Features />
      <Products1 />
      <TopCategoryProducts />
      <NewProducts />
      <Footer1 />
    </>
  );
}
