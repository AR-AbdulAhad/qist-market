"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const location = usePathname();
  return (
    <>
      {" "}
      <li>
        <Link href={`/my-account`} className={`my-account-nav-item ${location === "/my-account" ? "active" : ""}`}>Dashboard</Link>
      </li>
      <li>
        <Link href={`/my-account-orders`} className={`my-account-nav-item ${location === "/my-account-orders" ? "active" : ""}`}>
          Orders
        </Link>
      </li>
      <li>
        <Link href={`/my-account-address`} className={`my-account-nav-item ${location === "/my-account-address" ? "active" : ""}`}>
          Address
        </Link>
      </li>
      <li>
        <Link href={`/my-account-edit`} className={`my-account-nav-item ${location === "/my-account-edit" ? "active" : ""}`}>
          Account Details
        </Link>
      </li>
      <li>
        <button onClick={logout} className="my-account-nav-item check-btn">
          Logout
        </button>
      </li>
    </>
  );
}
