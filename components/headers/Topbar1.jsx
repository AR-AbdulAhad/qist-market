"use client";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import React, { useContext } from "react";

export default function Topbar1({ parentClass = "tf-topbar line-bt" }) {
  const { user } = useContext(AuthContext);
  return (
    <div className={parentClass}>
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-12">
            <div className="topbar-left justify-content-xl-start h-100">
              <p className="body-small text-main-2">
                <i className="icon-headphone" /> Call us for free:{" "}
                <a
                  href="tel:021-111-11-55-66"
                  className="text-primary link-secondary fw-semibold"
                >
                  0328 1125500
                </a>
              </p>
            </div>
          </div>
          <div className="col-xl-6 d-none d-xl-block">
            <div className="tf-cur justify-content-end bar-lang">
              {!user ?
              <a
                href="#log"
                data-bs-toggle="modal"
                className="tf-cur-item link"
              >
                <i className="icon-user-3" />
                <span className="body-small">My account:</span>
                <i className="icon-arrow-down" />
              </a>
              :
              <div className="dropdown">
                <a
                  href="#"
                  className="tf-cur-item link dropdown-toggle"
                  id="accountDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="icon-user-3" />
                  <span className="body-small">My account</span>
                  {/* <i className="icon-arrow-down" /> */}
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
                  {/* <li>
                    <a className="dropdown-item" href="#logout">
                      Logout
                    </a>
                  </li> */}
                </ul>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}