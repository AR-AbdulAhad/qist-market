'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import parse from "html-react-parser";

export default function Hero() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://qistbackend-1.onrender.com/api/categories', {
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
        console.error(error.message === 'Unauthorized' ? 'Please log in to access categories' : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);


  return (
    <section className="tf-sp-5">
      <div className="container">
        <div className="s-banner-wrapper">
          <div className="wrap-item-1 d-none d-lg-block">
            <div className="tf-nav-menu">
              <div className="main-nav">
                <h6 className="fw-semibold title">
                  <i className="icon-menu-dots" />
                  All Categories
                </h6>
                {loading ? (
                  <div className="loading-cs">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <ul className="menu-category-list custom-nav-cat">
                    {categories.map((category) => (
                      <li key={category.id} className="menu-item">
                        <Link
                          href={`/product-category/${category.slugName}`}
                          className="item-link body-text-3"
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-6 h-6"
                              dangerouslySetInnerHTML={{ __html: category.icon || "" }}
                            />
                            <span>{category.name}</span>
                          </span>
                        </Link>
                        {category.subcategories.length > 0 && (
                          <div className="sub-menu-container">
                            <ul className="sub-menu-list">
                              {category.subcategories.map((subcategory) => (
                                <li key={subcategory.id} className="sub-menu-item">
                                  <Link
                                    href={`/product-category/${category.slugName}/${subcategory.slugName}`}
                                    className="body-text-3 link"
                                  >
                                    {subcategory.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                    {categories.length === 0 && !loading && (
                      <li className="menu-item">
                        <span className="body-text-3">No categories available</span>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="wrap-item-2">
            <div
              className="banner-image-product-4 style-2 hover-img has-bg-img"
              style={{ backgroundImage: "url(/images/banner/banner-30.jpg)" }}
            >
              <div className="content">
                <div className="box-title">
                  <div className="d-grid gap-10">
                    <h2 className="fw-normal">
                      <Link
                        href={`/shop-default`}
                        className="link font-5 text-white"
                      >
                        The New <br />
                        Standard
                      </Link>
                    </h2>
                    <p className="title-sidebar-2 font-5 text-white">
                      Under favorable 360 cameras
                    </p>
                  </div>
                  <div className="box-price">
                    <p className="main-title-3 lh-19 text-cl-7">From</p>
                    <h1 className="fw-bold text-secondary lh-xxl-71 text-third-2">
                      $287
                    </h1>
                  </div>
                </div>
                <div className="box-btn">
                  <Link
                    href={`/shop-default`}
                    className="tf-btn-icon type-2 style-white"
                  >
                    <i className="icon-circle-chevron-right" />
                    <span>Shop now</span>
                  </Link>
                </div>
              </div>
              <Link
                href={`/shop-default`}
                className="img-style img-item overflow-visible"
              >
                <Image
                  src="/images/item/tivi-3.png"
                  alt=""
                  className="lazyload"
                  width={800}
                  height={794}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}