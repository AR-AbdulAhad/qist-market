import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import React from "react";
import Link from "next/link";
import Agreement from "@/components/otherPages/agreement/Agreement";

export const metadata = {
  title: "Qist Market - Agreement",
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
              <span className="body-small">Agreement</span>
            </li>
          </ul>
        </div>
      </div>
      <Agreement />
      <Features />
      <Footer1 />
    </>
  );
}
