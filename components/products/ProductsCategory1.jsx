"use client";

import React, { useEffect, useReducer, useState } from "react";
import FilterOptions2 from "./FilterOptions2";
import ShowLength from "./ShowLength";
import { initialState, reducer } from "@/reducer/filterReducer";
import LayoutHandler from "./LayoutHandler";
import ProductCards3 from "../productCards/ProductCards3";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ProductsCategory1({ categorySlug }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    itemPerPage: 10,
  });
  const {
    price,
    filtered,
    sortingOption,
    sorted,
    currentPage,
    itemPerPage,
  } = state;

  const allProps = {
    ...state,
    setPrice: (value) => dispatch({ type: "SET_PRICE", payload: value }),
    setSortingOption: (value) =>
      dispatch({ type: "SET_SORTING_OPTION", payload: value }),
    setCurrentPage: (value) =>
      dispatch({ type: "SET_CURRENT_PAGE", payload: value }),
    setItemPerPage: (value) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
      dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
    },
    clearFilter: () => {
      dispatch({ type: "CLEAR_FILTER" });
    },
  };

  const [productData, setProductData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          page: currentPage,
          limit: itemPerPage,
          ...(price[0] !== 0 && { minPrice: price[0] }),
          ...(price[1] !== 100 && { maxPrice: price[1] }),
          sort: "name",
          order: sortingOption === "Title Descending" ? "desc" : "asc",
        }).toString();

        const response = await fetch(`${BACKEND_URL}/api/product/category/${categorySlug}?${query}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const { data, pagination } = await response.json();
        setProductData(data);
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, itemPerPage, price, sortingOption]);

  useEffect(() => {
    const handleOpenFilter = () => {
      if (window.innerWidth <= 1200) {
        document.querySelector(".sidebar-filter").classList.add("show");
        document.querySelector(".overlay-filter").classList.add("show");
        document.body.classList.toggle("no-scroll");
      }
    };

    const handleCloseFilter = () => {
      document.querySelector(".sidebar-filter").classList.remove("show");
      document.querySelector(".overlay-filter").classList.remove("show");
      document.body.classList.toggle("no-scroll");
    };

    const openButtons = document.querySelectorAll("#filterShop, .sidebar-btn");
    const closeButtons = document.querySelectorAll(".close-filter, .overlay-filter");

    openButtons.forEach((button) => button.addEventListener("click", handleOpenFilter));
    closeButtons.forEach((button) => button.addEventListener("click", handleCloseFilter));

    return () => {
      openButtons.forEach((button) => button.removeEventListener("click", handleOpenFilter));
      closeButtons.forEach((button) => button.removeEventListener("click", handleCloseFilter));
    };
  }, []);

  const formatSlugName = (slug) => {
    if (!slug) return "";
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "); 
  };

  return (
    <div className="flat-content">
      <div className="container">
        <div className="tf-product-view-content wrapper-control-shop">
          <div className="canvas-filter-product sidebar-filter handle-canvas left">
            <div className="canvas-wrapper">
              <div className="canvas-header d-flex d-xl-none">
                <h5 className="title">Filter</h5>
                <span className="icon-close link icon-close-popup close-filter" />
              </div>
              <div className="canvas-body">
                <FilterOptions2 allProps={allProps} />
              </div>
              <div className="canvas-bottom d-flex d-xl-none">
                <button
                  id="reset-filter"
                  onClick={() => allProps.clearFilter()}
                  className="tf-btn btn-reset w-100"
                >
                  <span className="caption text-white">Reset Filters</span>
                </button>
              </div>
            </div>
          </div>
          <div className="content-area">
            <div className="tf-shop-control flex-wrap gap-10">
              <div className="d-flex align-items-center gap-10">
                <button id="filterShop" className="tf-btn-filter d-flex d-xl-none">
                  <span className="icon icon-filter">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      fill="#121212"
                      viewBox="0 0 256 256"
                    >
                      <path d="M176,80a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H184A8,8,0,0,1,176,80ZM40,88H144v16a8,8,0,0,0,16,0V56a8,8,0,0,0-16,0V72H40a8,8,0,0,0,0,16Zm176,80H120a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16ZM88,144a8,8,0,0,0-8,8v16H40a8,8,0,0,0,0,16H80v16a8,8,0,0,0,16,0V152A8,8,0,0,0,88,144Z" />
                    </svg>
                  </span>
                  <span className="body-md-2 fw-medium">Filter</span>
                </button>
                <p className="body-text-3">
                  <span className="count">{formatSlugName(categorySlug)}</span>
                </p>
                |
                <p className="body-text-3">
                  <span className="count">{totalItems}</span> Products Found
                </p>
              </div>
              <div className="tf-control-view flat-title-tab-product flex-wrap">
                <LayoutHandler loading={loading} hasProducts={productData.length > 0} />
                <ShowLength allProps={allProps} />
                <div className="tf-dropdown-sort tf-sort type-sort-by" data-bs-toggle="dropdown">
                  <div className="btn-select w-100">
                    <i className="icon-sort" />
                    <p className="body-text-3 w-100">
                      Sort by: <span className="text-sort-value">{sortingOption}</span>
                    </p>
                    <i className="icon-arrow-down fs-10" />
                  </div>
                  <div className="dropdown-menu">
                    {["Default", "Title Ascending", "Title Descending"].map((elm, i) => (
                      <div
                        key={i}
                        className={`select-item ${sortingOption === elm ? "active" : ""}`}
                        onClick={() => allProps.setSortingOption(elm)}
                      >
                        <span className="text-value-item">{elm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {(price[0] !== 0 || price[1] !== 100) && (
              <div className="meta-filter-shop">
                <div id="applied-filters">
                  {(price[0] !== 0 || price[1] !== 100) && (
                    <span
                      className="filter-tag"
                      onClick={() => allProps.setPrice([0, 100])}
                    >
                      Rs. {price[0]} to Rs. {price[1]}
                      <span className="remove-tag icon-close" />
                    </span>
                  )}
                </div>
                <button
                  id="remove-all"
                  className="remove-all-filters"
                  onClick={() => allProps.clearFilter()}
                >
                  <span className="caption">REMOVE ALL</span>
                  <i className="icon icon-close" />
                </button>
              </div>
            )}

            {loading ? (
              <div className="w-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : productData.length > 0 ? (
              <div className="gridLayout-wrapper">
                <div
                  className="tf-grid-layout lg-col-4 md-col-3 sm-col-2 flat-grid-product wrapper-shop layout-tabgrid-1"
                  id="gridLayout"
                >
                  {productData.map((product, i) => (
                    <ProductCards3 key={i} product={product} />
                  ))}
                  <ul className="wg-pagination wd-load">
                    <li>
                      <button
                        onClick={() => allProps.setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="link check-btn"
                      >
                        <i className="icon-arrow-left-lg" />
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li key={page} className={currentPage === page ? "active" : ""}>
                        <button
                          onClick={() => allProps.setCurrentPage(page)}
                          className="title-normal link check-btn"
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => allProps.setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="link check-btn"
                      >
                        <i className="icon-arrow-right-lg" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="w-100 d-flex justify-content-center align-items-center">
                <span>Product Not Found!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}