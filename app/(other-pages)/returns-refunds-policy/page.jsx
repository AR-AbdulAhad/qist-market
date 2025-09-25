import Features from "@/components/common/Features";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import React from "react";
import Link from "next/link";
import ReturnsRefundsPolicy from "@/components/otherPages/returns-refunds-policy/ReturnsRefundsPolicy";

export const metadata = {
  title: "Qist Market - Returns & Refunds Policy",
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
              <span className="body-small">Returns & Refunds Policy</span>
            </li>
          </ul>
        </div>
      </div>
      <ReturnsRefundsPolicy />
      <Features />
      <Footer1 />
    </>
  );
}
