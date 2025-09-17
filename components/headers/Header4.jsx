"use client";
import React, { useContext } from "react";
import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
import SearchForm from "./SearchForm";
import NavCategories from "./NavCategories";
import CartLength from "../common/CartLength";
import { AuthContext } from "@/context/AuthContext";
export default function Header4({ fullWidth = false }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="tf-header">
      <div className="inner-header line-bt">
        <div className={`container${fullWidth ? "-full" : ""}`}>
          <div className="row">
            <div className=" col-lg-2 col-6 d-flex align-items-center">
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
            <div className=" col-lg-8 d-none d-lg-block">
              <div className="header-center">
                <SearchForm parentClass="form-search-product m-auto" />
              </div>
            </div>
            <div className="col-lg-2 col-6 d-flex align-items-center justify-content-end">
              <div className="header-right">
                <ul className="nav-icon style-2">
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
                        <a className="dropdown-item" href="/my-account">
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/my-account-orders">
                          Orders History
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
      <div className="header-bottom d-none d-xl-block">
        <div className={`container${fullWidth ? "-full" : ""}`}>
          <div className="row">
            <div className="col-xxl-9 col-8">
              <div className="header-bt-left active-container">
                <NavCategories styleClass="" />
                <span className="br-line type-vertical bg-gray-2" />
                <nav className="main-nav-menu">
                  <ul className="nav-list">
                    <Nav />
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
