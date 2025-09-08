import React from "react";
import Products1 from "@/components/products/Products1";
import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import Header4 from "@/components/headers/Header4";

export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-sp-1">
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
              <span className="body-small">Shop</span>
            </li>
          </ul>
        </div>
      </div>
      <Products1 />
      <Footer1 />
      <div className="overlay-filter" id="overlay-filter" />
    </>
  );
}
