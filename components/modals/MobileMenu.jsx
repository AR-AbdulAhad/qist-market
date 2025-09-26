"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { othersPages } from "@/data/menu";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MobileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const isMenuActive = (link) => {
    return link.href?.split("/")[1] === pathname.split("/")[1];
  };

  const isMenuParentActive = (menu) => {
    return menu.some((elm) => isMenuActive(elm));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/limit/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: 1,
          limit: 10,
          search: searchTerm,
        });
        const response = await axios.get(`${BACKEND_URL}/api/product/search?${params.toString()}`);
        setSuggestions(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ query: searchTerm });
      await axios.get(`${BACKEND_URL}/api/product/search?${params.toString()}`);
      router.push(`/product/search?${params.toString()}`);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (slugName) => {
    setSearchTerm("");
    setSuggestions([]);
    router.push(`/product-detail/${slugName}`);
  };

  const handleCancel = () => {
    setSearchTerm("");
    setSuggestions([]);
    setIsLoading(false);
  };

  const handleViewMore = () => {
    router.push("/shop");
  };

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
                  <form onSubmit={handleSearchSubmit} className="form-search">
                    <fieldset className="search-input-container">
                      <input
                        type="text"
                        placeholder="Search for anything"
                        name="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        tabIndex={2}
                        aria-required="true"
                        required
                      />
                      {searchTerm.length > 0 && (
                        <span
                          className="icon-cancel link"
                          onClick={handleCancel}
                          aria-label="Clear search"
                        >
                          <i className="icon-close" />
                        </span>
                      )}
                    </fieldset>
                    {isLoading && (
                      <svg className="spinner" viewBox="0 0 50 50">
                        <circle
                          className="path"
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          strokeWidth="5"
                        />
                      </svg>
                    )}
                    <button type="submit" className="button-submit" disabled={isLoading}>
                      <i className="icon-search" />
                    </button>
                    {suggestions.length > 0 && !isLoading && (
                      <div className="suggestions-dropdown">
                        {suggestions.map((product) => (
                          <div
                            key={product.id}
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(product.slugName)}
                          >
                            <img
                              src={product.image_url || "/images/product-placeholder/product-placeholder-image.png"}
                              alt={product.name}
                              className="suggestion-image"
                              width={50}
                              height={50}
                            />
                            <div className="suggestion-details">
                              <span className="suggestion-name">{product.name}</span>
                              <span className="suggestion-price">
                                Rs. {product.advance?.toLocaleString() || 0} Advance
                              </span>
                            </div>
                          </div>
                        ))}
                        <div
                          className="view-more link"
                          onClick={handleViewMore}
                          aria-label="View more products"
                        >
                          View More
                        </div>
                      </div>
                    )}
                    {!isLoading && searchTerm.length >= 2 && suggestions.length === 0 && (
                      <div className="suggestions-dropdown">
                        <div className="no-suggestions">No products found</div>
                      </div>
                    )}
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