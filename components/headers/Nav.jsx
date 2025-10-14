"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Nav() {
  const pathname = usePathname();
  
  return (
    <>
      <li
        className={`nav-item ${pathname === "/" ? "active" : ""}`}
      >
        <Link href="/" className="item-link link body-md-2 fw-semibold">
          <span>Home</span>
        </Link>
      </li>
      <li
        className={`nav-item ${pathname === "/shop" ? "active" : ""}`}
      >
        <Link href="/shop" className="item-link body-md-2 fw-semibold">
          <span>Shop</span>
        </Link>
      </li>
      <li
        className={`nav-item ${pathname === "/contact" ? "active" : ""}`}
      >
        <Link href="/contact" className="item-link body-md-2 fw-semibold">
          <span>Contact</span>
        </Link>
      </li>
      <li
        className={`nav-item ${pathname === "/faq" ? "active" : ""}`}
      >
        <Link href="/faq" className="item-link body-md-2 fw-semibold">
          <span>FAQs</span>
        </Link>
      </li>
      <li
        className={`nav-item ${pathname === "/privacy" ? "active" : ""}`}
      >
        <Link href="/privacy" className="item-link body-md-2 fw-semibold">
          <span>Privacy</span>
        </Link>
      </li>
    </>
  );
}
