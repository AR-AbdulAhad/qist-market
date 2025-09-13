'use client';
import TopCategoryProductCard from "@/components/productCards/TopCategoryProductCard";
import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function TopCategoryProducts() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/active-top-categories`);
        const data = await response.json();
        setCategories(data.filter((category) => category.isActive));
      } catch (error) {
        console.error("Error fetching top categories:", error);
        setCategories([]);
      }
    };

    fetchTopCategories();
  }, []);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="tf-sp-2 pt-0">
      <div className="container">
        {categories.map((category, index) => (
          <div key={index} className="category-section mt-4">
            {/* Banner Image for the Category */}
            <div className="mb-4">
              <img
                src={category.image_url}
                alt={`Banner for ${category.category_name}`}
                className="product-banner mt-5"
              />
            {/* Category Name */}
            <div className="d-flex justify-content-between align-items-center mb-5 border px-4">
              <h2 className="fs-3">{category.category_name}</h2>
              <Link href={`/product-category/${category.slugName}`} className="check-btn link">View All</Link>
            </div>
            </div>
            {/* Products */}
            <div className="box-btn-slide-2 sw-nav-effect">
              <Swiper
                className="swiper tf-sw-products slider-thumb-deal"
                spaceBetween={15}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  575: { slidesPerView: 2 },
                  768: { slidesPerView: 3, spaceBetween: 20 },
                  992: { slidesPerView: 4, spaceBetween: 30 },
                }}
                modules={[Navigation, Pagination]}
                pagination={{
                  clickable: true,
                  el: `.spd14`,
                }}
                navigation={{
                  prevEl: `.snbp14`,
                  nextEl: `.snbn14`,
                }}
              >
                {category.products.map((product, prodIndex) => (
                  <SwiperSlide className="swiper-slide" key={prodIndex}>
                    <TopCategoryProductCard index={prodIndex} product={product} />
                  </SwiperSlide>
                ))}
                <div className="sw-dot-default sw-pagination-products justify-content-center spd14" />
              </Swiper>
              <div className="d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-products-2 snbp14">
                <i className="icon-arrow-left-lg" />
              </div>
              <div className="d-none d-xl-flex swiper-button-next nav-swiper nav-next-products-2 snbn14">
                <i className="icon-arrow-right-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}