"use client";

import React from "react";
import Footer1 from "@/components/footers/Footer1";
import Link from "next/link";
import Header4 from "@/components/headers/Header4";
import ProductsSubCategory1 from "@/components/products/ProductsSubCategory1";

export default function SubCategoryClient({ categorySlug, subCategorySlug }) {
  const formatSlugName = (slug) => {
    if (!slug) return "";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedCategory = formatSlugName(categorySlug);
  const formattedSubCategory = formatSlugName(subCategorySlug);

  return (
    <>
      <Header4 />
      <div className="tf-sp-1">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href="/" className="body-small link">
                Home
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <Link href="/shop" className="body-small link">
                Shop
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <Link
                href={`/category/${categorySlug}`}
                className="body-small link"
              >
                {formattedCategory}
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">
                {formattedSubCategory} Price in Pakistan
              </span>
            </li>
          </ul>
        </div>
      </div>

      <ProductsSubCategory1
        categorySlug={categorySlug}
        subCategorySlug={subCategorySlug}
      />
      <Footer1 />
      <div className="overlay-filter" id="overlay-filter" />
    </>
  );
}