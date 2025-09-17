"use client";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import React from "react";
import AddToCart from "../common/AddToCart";
import AddToQuickview from "../common/AddToQuickview";
import { useRouter } from "next/navigation";

export default function ProductCards3({ product }) {
  const productImageData = product.ProductImage[0]?.url;
  const router = useRouter();

  const goToProduct = () => {
    router.push(`/product-detail/${product.slugName}`);
  };

  return (
    <div className="card-product">
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.slugName}`} className="product-img">
          <img
            className="img-product ls-is-cached lazyloaded"
            src={productImageData}
            alt="image-product"
            width={500}
            height={500}
          />
          <img
            className="img-hover ls-is-cached lazyloaded"
            src={productImageData}
            alt="image-product"
            width={500}
            height={500}
          />
        </Link>
        <ul className="list-product-btn top-0 end-0">
          <li>
            <AddToCart productSlugName={product.slugName} tooltipClass="tooltip-left" />
          </li>
          <li>
            <AddToQuickview product={product} tooltipClass="tooltip-left" />
          </li>
        </ul>
      </div>
      <div className="card-product-info">
        <div className="box-title">
          <div>
            <Link
              href={`/product-detail/${product.slugName}`}
              className="name-product body-md-2 fw-semibold text-secondary link"
            >
              {product.name}
            </Link>
          </div>
          <p className="price-wrap fw-medium">
            <span className="new-price fw-medium">
              {product.advance ? (
                <span>
                  Rs. {product.advance} <span className="text-primary">Advance</span>
                </span>
              ) : (
                <span>Not Available</span>
              )}
            </span>
          </p>
        </div>
        <div className="box-infor-detail">
          <span className="body-md-2 text-main-2">{product.short_description}</span>
        </div>
        {/* Stock Status Display */}
        {product.stock === false && (
          <div className="bg-primary p-1 text-center rounded">
            <span className="body-md-2 fw-medium text-white">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="card-product-btn">
        <a
          href="#"
          data-bs-toggle="offcanvas"
          className="tf-btn btn-line w-100"
          onClick={goToProduct}
        >
          <span>Add to Cart</span>
          <i className="icon-cart-2" />
        </a>
      </div>
    </div>
  );
}