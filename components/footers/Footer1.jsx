"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
export default function Footer1({ fullWidth = false }) {

  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-mobile");

    const toggleOpen = (event) => {
      const parent = event.target.closest(".footer-col-block");
      const content = parent.querySelector(".tf-collapse-content");

      if (parent.classList.contains("open")) {
        parent.classList.remove("open");
        content.style.height = "0px";
      } else {
        parent.classList.add("open");
        content.style.height = content.scrollHeight + 10 + "px";
      }
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []);

  return (
    <footer className="tf-footer mt-5">
      <div className="ft-body-wrap">
        <div className="ft-body-inner">
          <div className={`container${fullWidth ? "-full" : ""}`}>
            <div className="ft-inner flex-wrap flex-xl-nowrap">
              <div className="ft-logo">
                <Link href={`/`} className="logo-site">
                  <Image
                    alt="Logo"
                    src="/images/logo/logo.png"
                    width={185}
                    height={41}
                  />
                </Link>
                <div className="tf-collapse-content">
                 <ul className="ft-menu-list ft-contact-list d-flex flex-column gap-3 ">
                      <li className="d-flex gap-2">
                        <span className="icon mt-1">
                          <i className="icon-location" />
                        </span>
                        <a href="#" className="link">
                          Shop-4, Plot # 43-C, <br/>DHA Phase 5 Badar  Commercial Area <br/> Defence V Defence Housing Authority, <br/> Karachi, 75500
                        </a>
                      </li>
                      <li className="d-flex gap-2">
                        <span className="icon">
                          <i className="icon-phone" />
                        </span>
                        <a href="#" className="product-title">
                          <span className="product-title text-primary">
                            0328 1125500
                          </span>
                        </a>
                      </li>
                      <li className="d-flex gap-2">
                        <span className="icon">
                          <i className="icon-direction" />
                        </span>
                        <a href="#" className="">
                          <span className="text-primary">
                            support@qistmarket.com
                          </span>
                        </a>
                      </li>
                    </ul>
                </div>
              </div>
              <ul className="ft-link-wrap w-100 tf-grid-layout md-col-2 lg-col-3">
                <li className="footer-col-block">
                  <h6 className="ft-heading footer-heading-mobile fw-semibold">
                    About
                  </h6>
                  <div className="tf-collapse-content">
                    <ul className="ft-menu-list">
                      <li>
                        <Link href={`/about`} className="link">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href={`/faq`} className="link">
                          FAQs
                        </Link>
                      </li>
                      <li>
                        <Link href={`/contact`} className="link">
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link href={`/visit-us`} className="link">
                          Visit Us
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="footer-col-block">
                  <h6 className="ft-heading footer-heading-mobile fw-semibold">
                    Information
                  </h6>
                  <div className="tf-collapse-content">
                    <ul className="ft-menu-list">
                      <li>
                        <Link href={`/my-account`} className="link">
                          Account
                        </Link>
                      </li>
                      <li>
                        <Link href={`/verification-process`} className="link">
                          Verification Process
                        </Link>
                      </li>
                      <li>
                        <Link href={`/delivery-policy`} className="link">
                          Delivery Policy
                        </Link>
                      </li>
                      <li>
                        <Link href={`/agreement`} className="link">
                          Agreement
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="footer-col-block">
                  <h6 className="ft-heading footer-heading-mobile fw-semibold">
                    Quick Links
                  </h6>
                  <div className="tf-collapse-content">
                    <ul className="ft-menu-list">
                      <li>
                        <Link href={`/terms-conditions`} className="link">
                          Terms &amp; Conditions
                        </Link>
                      </li>
                      <li>
                        <Link href={`/returns-refunds-policy`} className="link">
                          Returns &amp; Refunds Policy
                        </Link>
                      </li>
                      <li>
                        <Link href={`/track-your-order`} className="link">
                          Track your Order
                        </Link>
                      </li>
                      <li>
                        <Link href={`/privacy`} className="link">
                          Privacy Policy
                        </Link>
                      </li>
                      {/* <li>
                        <Link href={`/blog-grid`} className="link">
                          Press &amp; Blog
                        </Link>
                      </li> */}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="ft-body-center bg-gray">
          <div className={`container${fullWidth ? "-full" : ""}`}>
            <div className="ft-center justify-content-xxl-between d-flex flex-column">
              <div className="notice text-white justify-content-xxl-between">
                <div className="main-title fw-semibold mb-4">
                  Subscribe to Our Newsletter
                </div>
                
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendEmail(e);
                }}
                className="form-newsletter"
              >
                <div
                  className={`tfSubscribeMsg  footer-sub-element ${
                    showMessage ? "active" : ""
                  }`}
                >
                  {success ? (
                    <p style={{ color: "rgb(52, 168, 83)" }}>
                      You have successfully subscribed.
                    </p>
                  ) : (
                    <p style={{ color: "red" }}>Something went wrong</p>
                  )}
                </div>
                <div className="subscribe-content">
                  <fieldset className="email">
                    <input
                      type="email"
                      name="email"
                      className="subscribe-email type-fs-2"
                      placeholder="Enter your email address"
                      tabIndex={0}
                      aria-required="true"
                      required=""
                    />
                  </fieldset>
                  <div className="button-submit">
                    <button
                      className="subscribe-button tf-btn btn-large hover-shine"
                      type="submit"
                    >
                      <span className="body-md-2 fw-semibold text-white">
                        Subscribe
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div> */}
        <div className="ft-body-bottom">
          <div className={`container${fullWidth ? "-full" : ""}`}>
            <div className="ft-bottom">
              <ul className="social-list">
                <li>
                  <a href="https://facebook.com/Qistmarket">
                    <i className="icon-facebook" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/qistmarket/">
                    <i className="icon-instagram" />
                  </a>
                </li>
                {/* <li>
                  <a href="https://www.youtube.com/channel/UCiIHGTHqO8vhmfZiKSS6pdQ">
                    <i className="icon-youtube" />
                  </a>
                </li> */}
                <li>
                  <a href="https://www.linkedin.com/Qistmarket">
                    <i className="icon-linkin" />
                  </a>
                </li>
                <li>
                  <a href="https://web.whatsapp.com/">
                    <i className="icon-whatapp" />
                  </a>
                </li>
              </ul>
              <p className="nocopy caption text-center">
                <span className="fw-medium">Qist Market.</span>© 2025. All right
                reserved - Developed by Elipse Studio
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
