"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

export default function Footer1({ fullWidth = false }) {
  const { settings, isLoading, error } = useSettings();

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

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

  // Define static pages for "ABOUT", "INFORMATION", and "QUICK_LINKS" categories
  const staticAboutPages = [
    { title: "FAQs", slug: "faq", category: "ABOUT" },
    { title: "Contact", slug: "contact", category: "ABOUT" },
    { title: "Visit Us", slug: "visit-us", category: "ABOUT" },
  ];

  const staticInformationPages = [
    { title: "Account", slug: "my-account", category: "INFORMATION" },
    { title: "Agreement", slug: "agreement", category: "INFORMATION" },
  ];

  const staticQuickLinksPages = [
    { title: "Track Your Order", slug: "track-your-order", category: "QUICK_LINKS" },
  ];

  // Combine dynamic pages from settings with static pages
  const allPages = [
    ...staticInformationPages,
    ...(settings?.pages || []),
    ...staticAboutPages,
    ...staticQuickLinksPages,
  ];

  // Extract unique categories and format them to title case
  const categories = [
    ...new Set(allPages.map((page) => page.category)),
  ].sort(); // Sort for consistent order

  const formatCategoryTitle = (category) => {
    return category
      .toLowerCase()
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  return (
    <footer className="tf-footer mt-5">
      <div className="ft-body-wrap">
        <div className="ft-body-inner">
          <div className={`container${fullWidth ? "-full" : ""}`}>
            <div className="ft-inner flex-wrap flex-xl-nowrap">
              <div className="d-felx flex-column">
                <Link href="/" className="logo-site">
                  {isLoading ? (
                    <Image
                      alt="Default Logo"
                      src="/images/logo/logo.png"
                      width={185}
                      height={41}
                    />
                  ) : error ? (
                    <span>Error loading logo</span>
                  ) : settings?.logo_url ? (
                    <Image
                      alt={settings.name || "Logo"}
                      src={settings.logo_url}
                      width={185}
                      height={41}
                    />
                  ) : (
                    <Image
                      alt="Default Logo"
                      src="/images/logo/logo.png"
                      width={185}
                      height={41}
                    />
                  )}
                </Link>
                <div className="tf-collapse-content">
                  {isLoading ? (
                    ""
                  ) : error ? (
                    <p className="body-small text-danger">Error loading contact info</p>
                  ) : (
                    <ul className="ft-menu-list ft-contact-list d-flex flex-column gap-3 mt-2">
                      {settings?.address && (
                        <li className="d-flex gap-2">
                          <span className="icon mt-1">
                            <i className="icon-location" />
                          </span>
                          <a
                            href={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link address-link"
                          >
                            {settings.address}
                          </a>
                        </li>
                      )}
                      {settings?.phone && (
                        <li className="d-flex gap-2">
                          <span className="icon">
                            <i className="icon-phone" />
                          </span>
                          <a href={`tel:${settings.phone}`} className="product-title">
                            <span className="product-title text-primary">
                              {settings.phone}
                            </span>
                          </a>
                        </li>
                      )}
                      {settings?.email && (
                        <li className="d-flex gap-2">
                          <span className="icon">
                            <i className="icon-direction" />
                          </span>
                          <a href={`mailto:${settings.email}`} className="">
                            <span className="text-primary">
                              {settings.email}
                            </span>
                          </a>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <ul className="ft-link-wrap w-100 tf-grid-layout md-col-2 lg-col-3">
                {categories.map((category, index) => (
                  <li key={index} className="footer-col-block">
                    <h6 className="ft-heading footer-heading-mobile fw-semibold">
                      {formatCategoryTitle(category)}
                    </h6>
                    <div className="tf-collapse-content">
                      <ul className="ft-menu-list">
                        {allPages
                          .filter((page) => page.category === category)
                          .map((page, pageIndex) => (
                            <li key={pageIndex}>
                              <Link href={`/${page.slug}`} className="link">
                                {page.title}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="ft-body-bottom">
          <div className={`container${fullWidth ? "-full" : ""}`}>
            <div className="ft-bottom">
              {isLoading ? (
                ""
              ) : error ? (
                <p className="body-small text-danger">Error loading social links</p>
              ) : (
                <ul className="social-list">
                  {settings?.socialLinks && settings.socialLinks.length > 0 ? (
                    settings.socialLinks.map((link) => (
                      <li key={link.id}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          dangerouslySetInnerHTML={{ __html: link.svg }}
                        />
                      </li>
                    ))
                  ) : (
                    ""
                  )}
                </ul>
              )}
              <p className="nocopy caption text-center res-mb-ft">
                <span className="fw-medium">{settings?.name || "Qist Market"}</span>© {getCurrentYear()}. All rights reserved - Developed by <a href="https://elipsestudio.com" target="_blank" className="link">Elipse Studio</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}