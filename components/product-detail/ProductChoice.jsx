"use client";

import { useState } from "react";

export default function ProductChoice() {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="tf-product-info-choose-option flex-xl-nowrap">
      <div className="product-quantity">
        <p className="title body-text-3">Quantity</p>
        <div className="wg-quantity">
          <button
            className="btn-quantity btn-decrease"
            onClick={() => setQuantity((pre) => (pre == 1 ? 1 : pre - 1))}
          >
            <i className="icon-minus" />
          </button>
          <input
            className="quantity-product"
            type="text"
            readOnly
            value={quantity}
          />
          <button
            className="btn-quantity btn-increase"
            onClick={() => setQuantity((pre) => pre + 1)}
          >
            <i className="icon-plus" />
          </button>
        </div>
      </div>
      <div className="product-color">
        <p className="title body-text-3">Color</p>
        <div className="tf-select-color">
          <select className="select-color">
            <option>Graphite Black</option>
            <option>Graphite Blue</option>
          </select>
        </div>
      </div>
      <div className="product-box-btn">
        <a
          href="#shoppingCart"
          data-bs-toggle="offcanvas"
          className="tf-btn text-white"
        >
          Add to cart
          <i className="icon-cart-2" />
        </a>
      </div>
    </div>
  );
}
