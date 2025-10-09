"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderDetails() {
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = () => {
      try {
        const storedOrderData = sessionStorage.getItem("orderData");
        if (storedOrderData) {
          setOrderData(JSON.parse(storedOrderData));
        } else {
          setError(
            "You can monitor your order status by using your order number."
          );
        }
      } catch (err) {
        console.error("Error parsing order data:", err);
        setError("Failed to load order details.");
      }
    };

    fetchOrderData();

    const handleBeforeUnload = () => {
      sessionStorage.removeItem("orderData");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleTrackOrderClick = () => {
    router.push("/track-your-order");
  };

  if (error) {
    return (
      <section className="tf-sp-2">
        <div className="container">
          <div className="tf-order-detail text-center">
            <p className="fs-32">
              {error}{" "}
              <a
                href="#"
                onClick={handleTrackOrderClick}
                className="text-primary"
              >
                Click Here
              </a>
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!orderData) {
    return (
      <section className="tf-sp-2">
        <div className="container">
          <div className="tf-order-detail">
            <div className="w-100 d-flex justify-content-center align-items-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Rest of the component remains unchanged
  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="checkout-status tf-sp-2 pt-0">
          <div className="checkout-wrap">
            <span className="checkout-bar end" />
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-1" />
              </span>
              <Link href="/shop-cart" className="link-secondary body-text-3">
                Shopping Cart
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-2" />
              </span>
              <Link href="/checkout" className="link-secondary body-text-3">
                Shopping &amp; Checkout
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-3" />
              </span>
              <Link href="/order-details" className="text-secondary body-text-3">
                Confirmation
              </Link>
            </div>
          </div>
        </div>
        <div className="tf-order-detail">
          <div className="order-notice">
            <span className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                fill="#ffffff"
                viewBox="0 0 256 256"
              >
                <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.15-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.15,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.15,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.15,214.31,142.11ZM173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z" />
              </svg>
            </span>
            <p>Thank you. Your order has been received.</p>
          </div>
          <ul className="order-overview-list">
            <li>
              Order number: <strong>{orderData.id}</strong>
            </li>
            <li>
              Date:{" "}
              <strong>
                {new Date(orderData.createdAt).toLocaleDateString()}
              </strong>
            </li>
            <li>
              Advance: <strong>Rs. {Number(orderData.advanceAmount).toLocaleString()}</strong>
            </li>
            <li>
              Payment method: <strong>{orderData.paymentMethod}</strong>
            </li>
          </ul>
          <div className="order-detail-wrap">
            <h5 className="fw-bold">Order details</h5>
            <table className="tf-table-order-detail">
              <thead>
                <tr>
                  <td>
                    <h6 className="fw-semibold">Product</h6>
                  </td>
                  <td>
                    <h6 className="fw-semibold">Total Advance</h6>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="tf-order-item">
                  <td className="tf-order-item_product">
                    {orderData.productName} <span className="text-black"></span>
                  </td>
                  <td>
                    <span className="fw-medium">Rs. {Number(orderData.advanceAmount).toLocaleString()}</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th>
                    <span>Payment method:</span>
                  </th>
                  <td>
                    <span>{orderData.paymentMethod}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
            <table className="tf-table-order-detail">
              <thead>
                <tr>
                  <td>
                    <h6 className="fw-semibold">Advance Amount</h6>
                  </td>
                  <td>
                    <h6 className="fw-semibold">Installment Amount</h6>
                  </td>
                  <td>
                    <h6 className="fw-semibold">Months Plan</h6>
                  </td>
                  <td>
                    <h6 className="fw-semibold">Total Deal Value</h6>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="tf-order-item">
                  <td>
                    <span className="fw-medium">Rs. {Number(orderData.advanceAmount).toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="fw-medium">Rs. {Number(orderData.monthlyAmount).toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="fw-medium">Months: {orderData.months}</span>
                  </td>
                  <td>
                    <span className="fw-medium">Rs. {Number(orderData.totalDealValue).toLocaleString()}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row gap-30 gap-sm-0">
            <div>
              <div className="order-detail-wrap">
                <h5 className="fw-bold">Billing Address</h5>
                <table className="tf-table-order-detail">
                  <tbody>
                    <tr className="tf-order-item">
                      <td>
                        <span className="fw-medium">Customer Name:</span>
                      </td>
                      <td>
                        <span className="fw-medium">{orderData.fullName}</span>
                      </td>
                    </tr>
                    <tr className="tf-order-item">
                      <td>
                        <span className="fw-medium">WhatsApp Number:</span>
                      </td>
                      <td>
                        <span className="fw-medium">{orderData.phone}</span>
                      </td>
                    </tr>
                    {orderData.alternativePhone && (
                    <tr className="tf-order-item">
                      <td>
                        <span className="fw-medium">Alternative Number:</span>
                      </td>
                      <td>
                        <span className="fw-medium">{orderData.alternativePhone}</span>
                      </td>
                    </tr>
                     )}
                    {orderData.email && (
                    <tr className="tf-order-item">
                      <td>
                        <span className="fw-medium">Email:</span>
                      </td>
                      <td>
                        <span className="fw-medium">{orderData.email}</span>
                      </td>
                    </tr>
                     )}
                    <tr className="tf-order-item">
                      <td>
                        <span className="fw-medium">Address:</span>
                      </td>
                      <td>
                        <span className="fw-medium">{orderData.address}</span>
                      </td>
                    </tr>
                    <tr className="tf-order-item">
                      <td>
                        <span className="fw-medium">City, Area</span>
                      </td>
                      <td>
                        <span className="fw-medium">{orderData.city}</span>,
                        {" "}
                        <span className="fw-medium">{orderData.area}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {orderData.orderNotes && (
            <div className="order-detail-wrap">
              <h5 className="fw-bold">Order Notes</h5>
              <p>{orderData.orderNotes}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}