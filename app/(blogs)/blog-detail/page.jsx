import BlogDetails from "@/components/blogs/BlogDetails";
import RecentProducts from "@/components/common/RecentProducts";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Link from "next/link";
import React from "react";

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
              <span className="body-small">Blog Details</span>
            </li>
          </ul>
        </div>
      </div>
      <BlogDetails />
      <RecentProducts />

      <Footer1 />
    </>
  );
}
