"use client";

import { AuthContext } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import Link from "next/link";
import React, { useContext } from "react";

export default function Topbar1({ parentClass = "tf-topbar line-bt" }) {
  const { user, logout } = useContext(AuthContext);
  const { settings, isLoading, error } = useSettings();

  return (
    <div className={parentClass}>
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-12">
            <div className="topbar-left justify-content-xl-start h-100">
              {isLoading ? (
                  ""
              ) : error ? (
                <p className="body-small text-danger">Error loading contact info</p>
              ) : (
                <>
                  {settings?.phone && (
                    <p className="body-small text-main-2">
                      <i className="icon-headphone" /> Call us for free:{" "}
                      <a
                        href={`tel:${settings.phone}`}
                        className="text-primary link-secondary fw-semibold"
                      >
                        {settings.phone}
                      </a>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="col-xl-6 d-none d-xl-block">
            <div className="tf-cur justify-content-end bar-lang">
              {!user ? (
                <a
                  href="#log"
                  data-bs-toggle="modal"
                  className="tf-cur-item link"
                >
                  <i className="icon-user-3" />
                  <span className="body-small body-hide-res">Login / Register</span>
                  <i className="icon-arrow-down" />
                </a>
              ) : (
                <div className="dropdown">
                  <a
                    href="#"
                    className="tf-cur-item link"
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
                    <span className="body-small">
                      {user.fullName.split(' ')[0]}
                    </span>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}