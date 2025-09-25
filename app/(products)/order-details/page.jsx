import NewProducts from "@/components/common/NewProducts";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";

import OrderDetails from "@/components/shop-cart/OrderDetails";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Qist Market - Order Confirmation",
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
              <span className="body-small"> Order Detail</span>
            </li>
          </ul>
        </div>
      </div>

      <OrderDetails />
      <NewProducts />
      <Footer1 />
    </>
  );
}
