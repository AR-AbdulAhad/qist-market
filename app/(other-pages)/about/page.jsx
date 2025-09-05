import BrandsSlider from "@/components/common/BrandsSlider";
import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Blogs from "@/components/otherPages/about/Blogs";
import Hero from "@/components/otherPages/about/Hero";
import Testimonials from "@/components/otherPages/about/Testimonials";
import React from "react";
import Link from "next/link";
export const metadata = {
  title: "About || Onsus - Multipurpose React Nextjs eCommerce",
  description: "Onsus - Multipurpose React Nextjs eCommerce",
};
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
              <span className="body-small">About</span>
            </li>
          </ul>
        </div>
      </div>
      <Hero />
      <Features />
      <Testimonials />
      <BrandsSlider fullWidth />
      <Blogs />
      <Footer1 />
    </>
  );
}
