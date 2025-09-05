import React from "react";
import Link from "next/link";
export default function AccountOrders() {
  return (
    <div className="my-account-content account-dashboard">
      <h4 className="fw-semibold mb-20">Order History</h4>
      <div className="tf-order_history-table">
        <table className="table_def">
          <thead>
            <tr>
              <th className="title-sidebar fw-medium">Order ID</th>
              <th className="title-sidebar fw-medium">Date</th>
              <th className="title-sidebar fw-medium">Status</th>
              <th className="title-sidebar fw-medium">Total</th>
              <th className="title-sidebar fw-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="td-order-item">
              <td className="body-text-3">#12345</td>
              <td className="body-text-3">15 May 2024</td>
              <td className="body-text-3 text-delivered">Delivered</td>
              <td className="body-text-3">$690 / 3 items</td>
              <td>
                <Link
                  href={`/order-details`}
                  className="tf-btn btn-small d-inline-flex"
                >
                  <span className="text-white">Detail</span>
                </Link>
              </td>
            </tr>
            <tr className="td-order-item">
              <td className="body-text-3">#12345</td>
              <td className="body-text-3">15 May 2024</td>
              <td className="body-text-3 text-delivered">Delivered</td>
              <td className="body-text-3">$690 / 3 items</td>
              <td>
                <Link
                  href={`/order-details`}
                  className="tf-btn btn-small d-inline-flex"
                >
                  <span className="text-white">Detail</span>
                </Link>
              </td>
            </tr>
            <tr className="td-order-item">
              <td className="body-text-3">#12345</td>
              <td className="body-text-3">15 May 2024</td>
              <td className="body-text-3 text-on-the-way">On The Way</td>
              <td className="body-text-3">$690 / 3 items</td>
              <td>
                <Link
                  href={`/order-details`}
                  className="tf-btn btn-small d-inline-flex"
                >
                  <span className="text-white">Detail</span>
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
