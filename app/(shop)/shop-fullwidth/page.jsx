import React from "react";
import Header4 from "@/components/headers/Header4";
import RecentProducts from "@/components/common/RecentProducts";
import Features2 from "@/components/common/Features2";
import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import Products3 from "@/components/products/Products3";

export default function page() {
  return (
    <>
      <Header4 fullWidth />
      <div className="tf-sp-1">
        <div className="container-full">
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
              <span className="body-small">Product Grid</span>
            </li>
          </ul>
        </div>
      </div>

      <Products3 />
      <RecentProducts fullWidth />
      <Features2 fullWidth />
      <Footer1 fullWidth />
    </>
  );
}
