"use client";
import React from "react";
import Link from "next/link";
import {
  othersPages,
} from "@/data/menu";
import { usePathname } from "next/navigation";
export default function Nav() {
  const pathname = usePathname();
  const isMenuActive = (link) => {
    return link.href?.split("/")[1] == pathname.split("/")[1];
  };
  const isMenuParentActive = (menu) => {
    return menu.some((elm) => isMenuActive(elm));
  };
  

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
        className={`nav-item relative ${
          isMenuParentActive(othersPages) ? "active" : ""
        }`}
      >
        <a href="#" className="item-link body-md-2 fw-semibold">
          <span>Pages</span>
          <i className="icon icon-arrow-down" />
        </a>
        <div className="sub-menu-container">
          <ul className="sub-menu-list">
            {othersPages.map((item) => (
              <li
                key={item.id}
                className={` ${isMenuActive(item) ? "active" : ""}`}
              >
                <Link href={item.href} className="body-md-2 link">
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
      <li
        className={`nav-item ${pathname === "/payment-method" ? "active" : ""}`}
      >
        <Link href="/payment-method" className="item-link link body-md-2 fw-semibold">
          <span>Payment Method</span>
        </Link>
      </li>
      <li
        className={`nav-item ${pathname === "/stores" ? "active" : ""}`}
      >
        <Link href="/stores" className="item-link link body-md-2 fw-semibold">
          <span>Stores</span>
        </Link>
      </li>
    </>
  );
}
