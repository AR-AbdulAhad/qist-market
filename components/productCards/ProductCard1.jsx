"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AddToCart from "../common/AddToCart";
import AddToQuickview from "../common/AddToQuickview";

export default function ProductCard1({ product, index }) {
  const [currentImage, setCurrentImage] = useState(product.image_url);

  useEffect(() => {
    setCurrentImage(product.image_url);
  }, [product.image_url]);

  const productData = {
    id: product.product_id,
    title: product.product_name,
    category: product.category_name,
    categories_SlugName: product.categories_SlugName,
    subCategory: product.subcategory_name,
    subcategory_SlugName: product.subcategory_SlugName,
    slugName: product.slugName,
    imgSrc: product.image_url,
    advance: product.installments[0]?.advance || 0,
    progressWidth: "0%",
    width: 300,
    height: 300,
    wowDelay: index * 0.1 + "s",
  };

  return (
    <div
      className={`card-product style-border ${index < 4 ? "wow fadeInLeft" : ""}`}
      data-wow-delay={productData.wowDelay}
    >
      <div className="card-product-wrapper overflow-visible">
        <div className="product-thumb-image">
          <Link href={`/${product.categories_SlugName}/${product.subcategory_SlugName}/${product.slugName}`} className="card-image">
            <Image
              alt="Image Product"
              className="lazyload img-product"
              src={currentImage || "/images/product-placeholder/product-placeholder-image.png"}
              width={productData.width}
              height={productData.height}
            />
          </Link>
        </div>
        <ul className="list-product-btn top-0 end-0">
          <li>
            <AddToCart tooltipClass="tooltip-left" productSlugName={productData.slugName} categoriesSlugName={productData.categories_SlugName} subcategorySlugName={productData.subcategory_SlugName} />
          </li>
          <li>
            <AddToQuickview product={productData} tooltipClass="tooltip-left" />
          </li>
        </ul>
        <div className="box-sale-wrap top-0 start-0 z-5">
          <p className="title-sidebar-2">
            <span className="icon">
              <i className="icon-fire tf-ani-tada" />
            </span>
          </p>
        </div>
      </div>
      <div className="card-product-info">
        <div className="box-title">
          <div className="d-flex flex-column">
            <p className="caption text-main-2 font-2">
              {productData.category}, {productData.subCategory}
            </p>
            <Link
              href={`/${product.categories_SlugName}/${product.subcategory_SlugName}/${product.slugName}`}
              className="name-product body-md-2 fw-semibold text-secondary link"
            >
              {productData.title}
            </Link>
          </div>
          <p className="price-wrap fw-medium">
            <span className="new-price fw-medium">
              {productData.advance ? (
                <span>
                  Rs. {productData.advance.toLocaleString()}{" "}
                  <span className="text-primary">Advance</span>
                </span>
              ) : (
                <span>Not Available</span>
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}