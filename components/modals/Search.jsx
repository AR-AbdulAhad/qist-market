"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Search() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

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
    <div className="offcanvas offcanvas-top offcanvas-search" id="search">
      <div className="offcanvas-content">
        <div className="popup-header">
          <button
            className="icon-close icon-close-popup link"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="looking-for-wrap">
                <h3 className="heading fw-semibold text-center">
                  What are you looking for?
                </h3>
                <form onSubmit={handleSearchSubmit} className="form-search">
                  <fieldset className="search-input-container">
                    <input
                      type="text"
                      placeholder="Search for anything"
                      name="text"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}