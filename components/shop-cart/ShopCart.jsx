"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

export default function ShopCart() {
  const [cartData, setCartData] = useState(null);

  const updateCartData = () => {
    try {
      const data = Cookies.get("cartData");
      if (data) {
        setCartData(JSON.parse(data));
      } else {
        setCartData(null);
      }
    } catch (error) {
      console.error("Error parsing cartData cookie:", error);
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
    <div className="s-shoping-cart tf-sp-2">
      <div className="container">
        <div className="checkout-status tf-sp-2 pt-0">
          <div className="checkout-wrap">
            <span className="checkout-bar first" />
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-1" />
              </span>
              <Link href={`/shop-cart`} className="text-secondary body-text-3">
                Shopping Cart
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-2" />
              </span>
              <Link href={`/checkout`} className="link-secondary body-text-3">
                Shopping &amp; Checkout
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-3" />
              </span>
              <Link
                href={`/order-details`}
                className="link-secondary body-text-3"
              >
                Confirmation
              </Link>
            </div>
          </div>
        </div>
        <div className="form-discount">
          <div className="overflow-x-auto">
            {cartData ? (
              <>
              <table className="tf-table-page-cart">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Advance</th>
                    <th>Monthly</th>
                    <th>Months</th>
                    <th>Total Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tf-cart-item">
                    <td className="d-flex w-20">
                      <a href="#" className="img-box">
                        <Image
                          alt="product-image"
                          src={cartData.imageUrl || "/images/product-placeholder/product-placeholder-image.png"}
                          width={300}
                          height={300}
                        />
                      </a>
                      <div className="d-flex justify-content-center align-items-center">
                        <a
                          href={`/product-detail/${cartData.productSlug}`}
                          className="cart-title body-md-2 fw-semibold link"
                        >
                          {cartData.productName}
                        </a>
                      </div>
                    </td>
                    <td
                      data-cart-title="Advance"
                      className="tf-cart-item_quantity"
                    >
                      <p className="cart-price price-on-sale price-text fw-medium">
                        Rs. {cartData.selectedPlan.advance.toLocaleString()}
                      </p>
                    </td>
                    <td
                      data-cart-title="Advance"
                      className="tf-cart-item_quantity"
                    >
                      <p className="cart-price price-on-sale price-text fw-medium">
                        Rs. {cartData.selectedPlan.monthlyAmount.toLocaleString()}
                      </p>
                    </td>
                    <td
                      data-cart-title="Advance"
                      className="tf-cart-item_quantity"
                    >
                      <p className="cart-price price-on-sale price-text fw-medium">
                        {cartData.selectedPlan.months}
                      </p>
                    </td>
                    <td
                      data-cart-title="Total Price"
                      className="tf-cart-item_price"
                    >
                      <p className="cart-price price-on-sale price-text fw-medium">
                        Rs. {cartData.selectedPlan.totalPrice.toLocaleString()}
                      </p>
                    </td>
                    <td
                      data-cart-title="Remove"
                      className="remove-cart text-xxl-end"
                    >
                      <span
                        className="remove icon icon-close link"
                        onClick={removeItem}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              </>
            ) : (
              <div className="p-4 w-100">
                <div className="text-center">
                  Your Cart is empty. Start adding favorite products to cart!{" "}
                </div>
                <Link
                  className="tf-btn mt-2 mb-3 text-white"
                  style={{ width: "fit-content" }}
                  href="/shop"
                >
                  Explore Products
                </Link>
              </div>
            )}
          </div>
        </div>
        {cartData ?
        (
          <>
            <div className="cart-bottom justify-content-end px-0">
              <div className="border cart-card-cont mb-4">
                <div className="py-3 border-bottom pt-3 d-flex justify-content-between fs-6">
                  <div>Subtotal</div> <div>Rs. {cartData?.selectedPlan?.advance.toLocaleString() || 0}</div>
                </div>
                <div className="py-3 border-bottom">
                  <a
                    href={`/product-details/${cartData?.productSlug}`}
                    className="cart-title body-md-2 fw-semibold link"
                  >
                    {cartData?.productName} x 1
                  </a>
                </div>
                <div className="pt-3 d-flex justify-content-between fs-5">
                  <strong>Total Advance</strong> <strong className="text-primary">Rs. {cartData?.selectedPlan?.advance.toLocaleString() || 0}</strong>
                </div>
              </div>
            </div>
            <div className="box-btn mt-4">
              <Link href={`/checkout`} className="tf-btn">
                <span className="text-white">Proceed to checkout</span>
              </Link>
            </div>
          </>
        ) : (
            ""
        )}
      </div>
    </div>
  );
}