import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Topbar1 from "@/components/headers/Topbar1";
import Features from "@/components/common/Features";
import Hero from "@/components/homes/home-1/Hero";
import Products1 from "@/components/homes/home-1/Products1";
// import Products4 from "@/components/homes/home-1/Products4";
import NewProducts from "@/components/common/NewProducts";


export default function Home() {
  return (
    <>
      <Topbar1 />
      <Header1 />
      <Hero />
      <Features />
      <Products1 />
      {/* <Products4 /> */}
      <NewProducts />
      <Footer1 />
    </>
  );
}
