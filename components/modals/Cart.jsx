"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

export default function Cart() {
  const [cartData, setCartData] = useState(null);

  const updateCartData = () => {
    const data = Cookies.get("cartData");
    if (data) {
      setCartData(JSON.parse(data));
    } else {
      setCartData(null);
    }
  };

  useEffect(() => {
    updateCartData();

    const intervalId = setInterval(() => {
      updateCartData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const removeItem = () => {
    Cookies.remove("cartData", { path: "/" });
    setCartData(null);
  };

  return (
    <div
      className="offcanvas offcanvas-end popup-style popup-shopping-cart"
      id="shoppingCart"
    >
      <div className="popup-wrapper">
        <div className="popup-header">
          <h5 className="title fw-semibold">Shopping cart</h5>
          <span
            className="icon-close icon-close-popup link"
            data-bs-dismiss="offcanvas"
          />
        </div>
        {!cartData ? (
          <div className="minicart-empty text-center">
            <h6>
              Your cart is currently empty <br />
              Let us help you find the perfect item
            </h6>
            <Link href={`/shop`} className="tf-btn btn-gray w-100">
              <span className="text-white">Shop All Products</span>
            </Link>
          </div>
        ) : (
          <ul className="popup-body product-list-wrap">
            <li className="file-delete">
              <div className="card-product style-row row-small-2 align-items-center">
                <div className="card-product-wrapper">
                  <Link
                    href={`/${cartData.categories_SlugName}/${cartData.subcategory_SlugName}/${cartData.productSlug}`}
                    className="product-img"
                  >
                    <Image
                      className="lazyload"
                      src={cartData.imageUrl || "/images/product-placeholder/product-placeholder-image.png"}
                      alt="product-image"
                      width={500}
                      height={500}
                    />
                  </Link>
                </div>
                <div className="card-product-info">
                  <div className="box-title">
                    <Link
                      href={`/${cartData.categories_SlugName}/${cartData.subcategory_SlugName}/${cartData.productSlug}`}
                      className="name-product body-md-2 fw-semibold text-secondary link"
                    >
                      {cartData.productName}
                    </Link>
                    <p className="body-md-2">Plan: Rs {cartData.selectedPlan.monthlyAmount.toLocaleString()} x {cartData.selectedPlan.months} months</p>
                    <p className="price-wrap fw-medium">
                       <span>
                        Total Advance: <span className="text-primary">Rs. {cartData.selectedPlan.advance.toLocaleString()}</span>
                      </span>
                    </p>
                  </div>
                </div>
                <span
                  className="icon-close remove link"
                  onClick={removeItem}
                />
              </div>
            </li>
          </ul>
        )}
        <div className="popup-footer">
          <p className="cart-total fw-semibold">
            <span>Total Advance:</span>
            <span className="price-amount product-title text-primary">
              Rs. {cartData?.selectedPlan?.advance.toLocaleString() || 0}
            </span>
          </p>
          <div className="box-btn">
            <Link href={`/shop-cart`} className="tf-btn btn-gray">
              <span className="text-white">View Cart</span>
            </Link>
            <Link href={`/checkout`} className="tf-btn">
              <span className="text-white">Check Out</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}