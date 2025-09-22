'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Hero() {
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(`${BACKEND_URL}/api/limit/categories`, {
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
        setLoadingCategories(false);
      }
    };

    const fetchBanners = async () => {
      try {
        setLoadingBanners(true);
        const response = await fetch(`${BACKEND_URL}/api/active-banners`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }

        const data  = await response.json();
        setBanners(data);
      } catch (error) {
        console.error('Failed to fetch banners:', error.message);
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchCategories();
    fetchBanners();
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
                {loadingCategories ? (
                  <div className="loading-cs">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <ul className="menu-category-list">
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
                    {categories.length === 0 && !loadingCategories && (
                      <li className="menu-item">
                        <span className="body-text-3">No categories available</span>
                      </li>
                    )}
                    <li className="menu-item py-3 px-4 d-flex justify-content-center">
                      <Link href="/shop" className="body-text-3 text-primary">
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6"></span>
                          <span>View All Categories</span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="wrap-item-2">
            {loadingBanners ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : banners.length === 0 ? (
              <div className="text-center">
                <p className="body-text-3">No banners available</p>
              </div>
            ) : (
              <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target="#bannerCarousel"
                      data-bs-slide-to={index}
                      className={index === 0 ? 'active' : ''}
                      aria-current={index === 0 ? 'true' : 'false'}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
                <div className="carousel-inner">
                  {banners.map((banner, index) => (
                    <div key={banner.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <Link href={banner.product_url} className="d-block w-100">
                        <Image
                          src={banner.image_url}
                          alt={`Banner ${banner.id}`}
                          className="d-block w-100 lazyload"
                          width={1200}
                          height={600}
                          style={{ objectFit: 'cover', height: '100%' }}
                          priority={index === 0}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#bannerCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#bannerCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}