import NewProducts from "@/components/common/NewProducts";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Checkout from "@/components/shop-cart/Checkout";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Qist Market - Checkout",
  robots: "noindex, nofollow",
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
              <span className="body-small"> Check Out</span>
            </li>
          </ul>
        </div>
      </div>

      <Checkout />
      <NewProducts />
      <Footer1 />
    </>
  );
}
