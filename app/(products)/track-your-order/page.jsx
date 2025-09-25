import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import OrderTraking from "@/components/shop-cart/OrderTraking";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Qist Market - Track Order",
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
