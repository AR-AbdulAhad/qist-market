"use client";
import React, { useContext } from "react";
import Nav from "./Nav";
import Image from "next/image";
import Link from "next/link";
import SearchForm from "./SearchForm";
import CartLength from "../common/CartLength";
import { AuthContext } from "@/context/AuthContext";

export default function Header1() {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="tf-header style-2">
      <div className="inner-header">
        <div className="container">
          <div className="row">
            <div className="col-xl-2 col-md-3 col-7 d-flex align-items-center">
              <div className="logo-site">
                <Link href={`/`}>
                  <Image
                    alt="Logo"
                    src="/images/logo/logo.png"
                    width={185}
                    height={41}
                  />
                </Link>
              </div>
            </div>
            <div className="col-md-7 d-none d-md-block">
              <div className="header-center justify-content-end">
                <SearchForm />
              </div>
            </div>
            <div className="col-xl-3 col-md-2 col-5 d-flex align-items-center justify-content-end">
              <div className="header-right">
                <div className="support-wrap d-none d-xl-flex">
                  <Image
                    alt=""
                    className="flex-shrink-0"
                    style={{ height: 44, width: 44 }}
                    src="/icons/headphone-2.svg"
                    width={44}
                    height={44}
                  />
                  <div className="content">
                    <p className="call-us body-text-3">
                      Call us now:{" "}
                      <a
                        href="tel:021-111-11-55-66"
                        className="text-primary link-main body-md-2"
                      >
                        0328 1125500
                      </a>
                    </p>
                    <p className="mail-us body-text-3">
                      Email:{" "}
                      <a
                        href="mailto:support@qistbazaar.pk"
                        className="text-secondary link-main"
                      >
                        support@qistmarket.com
                      </a>
                    </p>
                  </div>
                </div>
                <ul className="nav-icon style-2 d-xl-none">
                    <li className="nav-account">
                      {!user ?
                    <a
                      href="#log"
                      data-bs-toggle="modal"
                      className="tf-cur-item link d-flex align-items-center gap-1"
                    >
                      <i className="icon-user-3" />
                      <span className="body-small">Login / Register</span>
                      <i className="icon-arrow-down" />
                    </a>
                    :
                    <div className="dropdown">
                      <a
                        href="#"
                        className="tf-cur-item link d-flex align-items-center gap-1"
                        id="accountDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <svg
                          width={17}
                          height={17}
                          viewBox="0 0 22 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.9998 11.5283C5.20222 11.5283 0.485352 16.2452 0.485352 22.0428C0.485352 22.2952 0.69017 22.5 0.942518 22.5C1.19487 22.5 1.39968 22.2952 1.39968 22.0428C1.39968 16.749 5.70606 12.4426 10.9999 12.4426C16.2937 12.4426 20.6001 16.749 20.6001 22.0428C20.6001 22.2952 20.8049 22.5 21.0572 22.5C21.3096 22.5 21.5144 22.2952 21.5144 22.0428C21.5144 16.2443 16.7975 11.5283 10.9998 11.5283Z"
                            fill="#333E48"
                            stroke="#333E48"
                            strokeWidth="0.3"
                          />
                          <path
                            d="M10.9999 0.5C8.22767 0.5 5.97119 2.75557 5.97119 5.52866C5.97119 8.30174 8.22771 10.5573 10.9999 10.5573C13.772 10.5573 16.0285 8.30174 16.0285 5.52866C16.0285 2.75557 13.772 0.5 10.9999 0.5ZM10.9999 9.64303C8.73146 9.64303 6.88548 7.79705 6.88548 5.52866C6.88548 3.26027 8.73146 1.41429 10.9999 1.41429C13.2682 1.41429 15.1142 3.26027 15.1142 5.52866C15.1142 7.79705 13.2682 9.64303 10.9999 9.64303Z"
                            fill="#333E48"
                            stroke="#333E48"
                            strokeWidth="0.3"
                          />
                        </svg>
                        <span className="body-small">{user.firstName}</span>
                        <i className="icon-arrow-down" />
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                        <li>
                          <Link className="dropdown-item" href="/my-account">
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="/my-account-orders">
                            Orders History
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="/my-account-address">
                            Address
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="/my-account-edit">
                            Account Details
                          </Link>
                        </li>
                        <li>
                          <button onClick={logout} className="dropdown-item">
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                    }
                    </li>
                    <li className="nav-shop-cart">
                      <a
                        href="#shoppingCart"
                        data-bs-toggle="offcanvas"
                        className="d-flex"
                      >
                        <i className="icon-cart text-main fs-26 link" />
                        <span className="count-box">
                          <CartLength />
                        </span>
                      </a>
                    </li>
                    <li className="d-flex align-items-center d-xl-none btn-mobile">
                      <a
                        href="#mobileMenu"
                        className="mobile-button"
                        data-bs-toggle="offcanvas"
                        aria-controls="mobileMenu"
                      >
                        <span />
                      </a>
                    </li>
                  </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-bottom bg-gray-5 d-none d-xl-block">
        <div className="container relative">
          <div className="row">
            <div className="col-xl-9 col-12">
              <div className="header-bt-left">
                <nav className="main-nav-menu">
                  <ul className="nav-list">
                    <Nav />
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-xl-3 d-none d-xl-flex align-items-center justify-content-end">
              <div className="header-bt-right">
                <ul className="nav-icon style-2">
                  <li className="nav-shop-cart">
                    <a
                      href="#shoppingCart"
                      data-bs-toggle="offcanvas"
                      className="d-flex"
                    >
                      <i className="icon-cart text-main fs-26 link" />
                      <span className="count-box">
                        <CartLength />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
