"use client";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AccountOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        console.log(data);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="my-account-content account-dashboard">
      <h4 className="fw-semibold mb-20">Order History</h4>
      <div className="tf-order_history-table">
        <table className="table_def">
          <thead>
            <tr>
              <th className="title-sidebar fw-medium">Order No</th>
              <th className="title-sidebar fw-medium">Product Name</th>
              <th className="title-sidebar fw-medium">Status</th>
              <th className="title-sidebar fw-medium">Advance Amount</th>
              <th className="title-sidebar fw-medium">Installment * month</th>
              <th className="title-sidebar fw-medium">Action</th>
            </tr>
          </thead>
          {loading ? 
            <tbody>
              <tr>
                <td colSpan="6">
                  <div className="p-4 d-flex justify-content-center align-items-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
            :
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="td-order-item">
                  <td className="body-text-3">{order.id}</td>
                  <td className="body-text-3">{order.productName}</td>
                  <td className="body-text-3 text-delivered">{order.status}</td>
                  <td className="body-text-3">Rs. {order.advanceAmount}</td>
                  <td className="body-text-3">Rs. {order.monthlyAmount} / {order.months} months </td>
                  <td>
                    <Link href={`/order-details/${order.id}`} className="tf-btn btn-small d-inline-flex">
                      <span className="text-white">Detail</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">
                <div className="p-4 text-center">
                  <h5 className="mb-2">No orders found</h5>
                  <p className="mb-3">You have not placed any orders yet.</p>
                  <Link href="/shop" className="tf-btn btn-small d-inline-flex">
                    <span className="text-white">Shop Now</span>
                  </Link>
                </div>  
              </td>
              </tr>
            )}
          </tbody>
          }
        </table>
      </div>
    </div>
  );
}