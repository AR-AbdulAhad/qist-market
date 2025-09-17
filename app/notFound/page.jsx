import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import React from "react";
import Link from "next/link";

export default function page() {
  return (
    <>
      <Header4 />
      <>
        <div className="tf-sp-1 pb-0">
          <div className="container">
            <ul className="breakcrumbs">
              <li>
                <Link href={`/`} className="body-small link">
                  {" "}
                  Home{" "}
                </Link>
              </li>
              <li className="d-flex align-items-center">
                <i className="icon icon-arrow-right" />
              </li>
              <li>
                <span className="body-small">404 Not Found</span>
              </li>
            </ul>
          </div>
        </div>
        {/* /Breakcrumbs */}
        {/* 404 Not Found */}
        <section className="tf-sp-6">
          <div className="container">
            <div className="wg-404 text-center">
              <h1 className="text-primary">404</h1>
              <p className="notice title-normal fw-semibold">
                <span className="text-primary">Whoops!</span> We couldn’t find
                the page you were looking for.
              </p>
              <div className="box-btn">
                <Link href={`/`} className="tf-btn text-white d-inline-flex">
                  Back To Home Page
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
      <Footer1 />
    </>
  );
}
