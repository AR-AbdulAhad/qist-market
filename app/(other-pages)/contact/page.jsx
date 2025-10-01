import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Contact from "@/components/otherPages/Contact";
import React from "react";
import Link from "next/link";
import NewProducts from "@/components/common/NewProducts";

export const metadata = {
  title: "Qist Market - Contact Us",
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
              <span className="body-small">Contact</span>
            </li>
          </ul>
        </div>
      </div>
      <Contact />
      <NewProducts />
      <Footer1 />
    </>
  );
}
