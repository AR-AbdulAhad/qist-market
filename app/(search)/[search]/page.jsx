// New Frontend: Search Page (/search/page.js)
"use client";
import React from "react";
import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import Header4 from "@/components/headers/Header4";
import ProductsSearch from "@/components/products/ProductsSearch";

export default function SearchPage() {
  return (
    <>
      <Header4 />
      <div className="tf-sp-1">
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
              <Link href={`/shop`} className="body-small link">
                Shop
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">Search Results</span>
            </li>
          </ul>
        </div>
      </div>
      <ProductsSearch />
      <Footer1 />
      <div className="overlay-filter" id="overlay-filter" />
    </>
  );
}