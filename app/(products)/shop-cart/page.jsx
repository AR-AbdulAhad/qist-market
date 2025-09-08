import Features2 from "@/components/common/Features2";
import RecentProducts from "@/components/common/RecentProducts";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import ShopCart from "@/components/shop-cart/ShopCart";
import Testimonials from "@/components/shop-cart/Testimonials";
import React from "react";
import Link from "next/link";

export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-sp-3 pb-0">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href={`/`} className="body-small link">
                Home
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">Cart</span>
            </li>
          </ul>
        </div>
      </div>
      <ShopCart />
      <Testimonials />
      <RecentProducts />
      <Features2 />
      <Footer1 />
    </>
  );
}
