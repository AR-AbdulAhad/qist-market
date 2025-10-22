"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SearchForm({
  parentClass = "form-search-product style-2",
}) {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All categories");
  const [categories, setCategories] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/limit/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        if (selectedType === "category" && selectedSlug) {
          params.append("category", selectedSlug);
        } else if (selectedType === "subcategory" && selectedSlug) {
          params.append("subcategory", selectedSlug);
        }
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
  }, [searchTerm, selectedType, selectedSlug]);

  const handleSelectCategory = (label, type, slug) => {
    setActiveCategory(label);
    setSelectedType(type);
    setSelectedSlug(slug);
    setActiveDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ query: searchTerm });
    if (selectedType && selectedSlug) {
      params.append(selectedType, selectedSlug);
    }
    router.push(`/product/search?${params.toString()}`);
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
    <form ref={navRef} onSubmit={handleSubmit} className={parentClass}>
      <div className={`select-category ${activeDropdown ? "active" : ""}`}>
        <div onClick={() => setActiveDropdown(true)} className="tf-select-custom">
          {activeCategory}
        </div>
        <ul className="select-options" style={{ display: activeDropdown ? "block" : "none" }}>
          <div className="header-select-option">
            <span>Select Categories</span>
            <span className="close-option" onClick={() => setActiveDropdown(false)}>
              <i className="icon-close"></i>
            </span>
          </div>
          <li
            onClick={() => handleSelectCategory("All categories", null, null)}
          >
            All categories
          </li>
          {categories.map((cat) => (
            <ul key={cat.id}>
              <li 
              className="w-100"
                onClick={() => handleSelectCategory(cat.name, "category", cat.slugName)}
              >
                <strong>{cat.name}</strong>
              </li>
              {cat.subcategories.map((sub) => (
                <li
                  key={sub.id}
                  className="w-100 sub-mar"
                  onClick={() => handleSelectCategory(`${cat.name} - ${sub.name}`, "subcategory", sub.slugName)}
                >
                  {sub.name}
                </li>
              ))}
            </ul>
          ))}
        </ul>
      </div>
      <span className="br-line type-vertical bg-line"></span>
      <fieldset className="search-input-container">
        <input
          type="text"
          placeholder="Search for products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
        <div className="loader">
          <svg className="spinner" viewBox="0 0 50 50">
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            ></circle>
          </svg>
        </div>
      )}
      <button type="submit" className="btn-submit-form">
        <i className="icon-search"></i>
      </button>
      {suggestions.length > 0 && !isLoading && (
        <div className="suggestions-dropdown">
          {suggestions.map((product) => (
            <div
              key={product.id}
              className="suggestion-item"
              onClick={() => router.push(`/${product.categories_SlugName}/${product.subcategory_SlugName}/${product.slugName}`)}
            >
              <img
                src={product.image_url || "/images/product-placeholder/product-placeholder-image.png"}
                alt={product.name}
                className="suggestion-image"
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
            aria-label="View all products"
          >
            View All
          </div>
        </div>
      )}
      {!isLoading && searchTerm.length >= 2 && suggestions.length === 0 && (
        <div className="suggestions-dropdown">
          <div className="no-suggestions">No products found</div>
        </div>
      )}
    </form>
  );
}