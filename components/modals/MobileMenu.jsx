"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  blogMenuItems,
  demoItems,
  othersPages,
  shopDetailsPages,
  shopPages,
} from "@/data/menu";

export default function MobileMenu() {
  const pathname = usePathname();
  const [categories, setCategories] = useState([]);

  // Function to check if a menu item is active
  const isMenuActive = (link) => {
    return link.href?.split("/")[1] == pathname.split("/")[1];
  };

  const isMenuParentActive = (menu) => {
    return menu.some((elm) => isMenuActive(elm));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/limit/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <span
        className="icon-close btn-close-mb link"
        data-bs-dismiss="offcanvas"
      />
      <div className="logo-site">
        <Link href={`/`}>
          <Image alt="" src="/images/logo/logo.png" width={185} height={41} />
        </Link>
      </div>
      <div className="mb-canvas-content">
        <div className="mb-body">
          <div className="flat-animate-tab">
            <div className="flat-title-tab-nav-mobile">
              <ul className="menu-tab-line" role="tablist">
                <li className="nav-tab-item" role="presentation">
                  <a
                    href="#main-menu"
                    className="tab-link link fw-semibold active"
                    data-bs-toggle="tab"
                  >
                    Menu
                  </a>
                </li>
                <li className="br-line type-vertical bg-line h23" />
                <li className="nav-tab-item" role="presentation">
                  <a
                    href="#category"
                    className="tab-link link fw-semibold"
                    data-bs-toggle="tab"
                  >
                    Categories
                  </a>
                </li>
              </ul>
            </div>
            <div className="tab-content">
              <div
                className="tab-pane active show"
                id="main-menu"
                role="tabpanel"
              >
                <div className="mb-content-top">
                  <form action="#" className="form-search">
                    <fieldset>
                      <input
                        className=""
                        type="text"
                        placeholder="Search for anything"
                        name="search"
                        tabIndex={2}
                        defaultValue=""
                        aria-required="true"
                        required=""
                      />
                    </fieldset>
                    <button type="submit" className="button-submit">
                      <i className="icon-search" />
                    </button>
                  </form>
                  <ul className="nav-ul-mb" id="wrapper-menu-navigation">
                    <li
                      className={`nav-mb-item ${pathname === "/" ? "active" : ""}`}
                    >
                      <Link href="/" className="mb-menu-link">
                        <span>Home</span>
                      </Link>
                    </li>
                    <li
                      className={`nav-mb-item ${pathname === "/shop" ? "active" : ""}`}
                    >
                      <Link href="/shop" className="mb-menu-link">
                        <span>Shop</span>
                      </Link>
                    </li>
                    <li
                      className={`nav-mb-item ${
                        isMenuParentActive(othersPages) ? "active" : ""
                      } `}
                    >
                      <a
                        href="#dropdown-menu-page"
                        className="collapsed mb-menu-link"
                        data-bs-toggle="collapse"
                        aria-expanded="true"
                        aria-controls="dropdown-menu-page"
                      >
                        <span>Pages</span>
                        <span className="btn-open-sub" />
                      </a>
                      <div id="dropdown-menu-page" className="collapse">
                        <ul className="sub-nav-menu">
                          {othersPages.map((item, i) => (
                            <li key={i}>
                              <Link
                                href={item.href}
                                className={`sub-nav-link body-md-2 ${
                                  isMenuActive(item) ? "active" : ""
                                }`}
                              >
                                <span>{item.text}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                    <li
                      className={`nav-mb-item ${pathname === "/payment-method" ? "active" : ""}`}
                    >
                      <Link href="/payment-method" className="mb-menu-link">
                        <span>Payment Method</span>
                      </Link>
                    </li>
                    <li
                      className={`nav-mb-item ${pathname === "/stores" ? "active" : ""}`}
                    >
                      <a href="/stores" className="mb-menu-link">
                        <span>Stores</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mb-other-content">
                  <ul className="mb-info">
                    <li>
                      <p>
                        Address:
                        <a
                          target="_blank"
                          href="https://www.google.com/maps?q=8500LoremStreetChicago,IL55030Dolorsitamet"
                        >
                          <span className="fw-medium">
                            8500 Lorem Street Chicago, IL 55030 Dolor
                          </span>
                        </a>
                      </p>
                    </li>
                    <li>
                      <p>
                        Phone:
                        <a href="tel:+88001234567">
                          <span className="fw-medium">+8(800) 123 4567</span>
                        </a>
                      </p>
                    </li>
                    <li>
                      <p>
                        Email:
                        <a href="mailto:onsus@support.com">
                          <span className="fw-medium">onsus@support.com</span>
                        </a>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="tab-pane" id="category" role="tabpanel">
                <div className="mb-content-top">
                  <ul className="nav-ul-mb">
                    {categories.map((category) => (
                      <li key={category.id} className="nav-mb-item">
                        {category.subcategories.length > 0 ? (
                          <>
                            <div className="mb-menu-link-wrapper">
                              <Link
                                href={`/product-category/${category.slugName}`}
                                className="mb-menu-link link"
                              >
                                <span>{category.name}</span>
                              </Link>
                              <span
                                className="btn-open-sub link"
                                data-bs-toggle="collapse"
                                data-bs-target={`#drd-categories-${category.slugName}`}
                                aria-expanded="false"
                                aria-controls={`drd-categories-${category.slugName}`}
                              />
                            </div>
                            <div
                              id={`drd-categories-${category.slugName}`}
                              className="collapse"
                            >
                              <ul className="sub-nav-menu">
                                {category.subcategories.map((subcategory) => (
                                  <li key={subcategory.id}>
                                    <Link
                                      href={`/product-category/${category.slugName}/${subcategory.slugName}`}
                                      className="sub-nav-link link"
                                    >
                                      {subcategory.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        ) : (
                          <Link
                            href={`/product-category/${category.slugName}`}
                            className="mb-menu-link link"
                          >
                            <span>{category.name}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}