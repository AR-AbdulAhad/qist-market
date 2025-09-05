import React from "react";
import Link from "next/link";
export default function Sidebar() {
  return (
    <>
      {" "}
      <li>
        <span className="my-account-nav-item active">Dashboard</span>
      </li>
      <li>
        <Link href={`/my-account-orders`} className="my-account-nav-item">
          Orders
        </Link>
      </li>
      <li>
        <Link href={`/my-account-address`} className="my-account-nav-item">
          Address
        </Link>
      </li>
      <li>
        <Link href={`/my-account-edit`} className="my-account-nav-item">
          Account Details
        </Link>
      </li>
      <li>
        <Link href={`/wishlist`} className="my-account-nav-item">
          Wishlist
        </Link>
      </li>
      <li>
        <Link href={`/`} className="my-account-nav-item">
          Logout
        </Link>
      </li>
    </>
  );
}
