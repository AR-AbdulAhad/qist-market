"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function NavCategories({ styleClass = "" }) {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.errpr(error.message === 'Unauthorized' ? 'Please log in to access categories' : 'Failed to fetch categories',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const formatUrlName = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div ref={navRef} className={`nav-category-wrap ${styleClass}`}>
      <div
        onClick={() => setActiveDropdown((pre) => !pre)}
        className={`nav-title btn-active ${activeDropdown ? "active" : ""} `}
      >
        <i className="icon-menu-dots fs-20" />
        <h6 className="title fw-semibold">All Categories</h6>
      </div>
      <nav
        className={`category-menu active-item  ${
          activeDropdown ? "active" : ""
        }`}
      >
        <div className="menu-category-menu-container">
          {loading ? (
            <div className="loading-cs">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
          <ul id="primary-menu" className="megamenu">
            {categories.map((category) => (
            <li key={category.id} className="menu-item">
              <Link href={formatUrlName(category.name)}>
                <span
                  className="w-6 h-6"
                  dangerouslySetInnerHTML={{ __html: category.icon || "" }}
                />
                <span>{category.name}</span>
              </Link>
            </li>
            ))}
          </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
