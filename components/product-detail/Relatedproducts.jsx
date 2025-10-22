"use client";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/public/css/animate.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function NewProducts({
  parentClass = "tf-sp-2",
  fullWidth = false,
  subcategorySlugName,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);
  const wowRef = useRef(null);

  useEffect(() => {
    let wowInstance = null;

    const initWOW = async () => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        const WOWModule = await import("@/utlis/wow");
        wowInstance = new WOWModule.default({
          boxClass: "wow",
          animateClass: "animated",
          offset: 0,
          mobile: true,
          live: true,
        });
        wowRef.current = wowInstance;
        wowInstance.init();
      } catch (err) {
        console.error("Failed to initialize WOW:", err);
      }
    };

    initWOW();

    const fetchProducts = async () => {
      if (!subcategorySlugName) {
        setError("No subcategory slug provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/product/subcategory/related/${subcategorySlugName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        const mappedProducts = data.map((item, index) => ({
          id: item.id,
          title: item.name,
          slugName: item.slugName,
          category: item.category_name,
          categories_SlugName: item.categories_SlugName,
          subCategory: item.subcategory_name,
          subcategory_SlugName: item.subcategory_SlugName,
          advance: item.advance || 0,
          imgSrc: item.image_url,
          imgWidth: 300,
          imgHeight: 300,
          imgHover: item.image_url,
          hoverWidth: 300,
          hoverHeight: 300,
          animation: "fadeInUp",
          wowDelay: `${index * 0.2}s`,
        }));

        setProducts(mappedProducts);
        setLoading(false);
        if (wowRef.current) {
          wowRef.current.sync();
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      if (wowRef.current) {
        wowRef.current = null;
      }
    };
  }, [subcategorySlugName]);

  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    if (wowRef.current) {
      wowRef.current.sync();
    }
  };

  const handleSlideChange = () => {
    if (wowRef.current) {
      wowRef.current.sync();
    }
  };

  if (loading) {
    return (
      <section className={parentClass}>
        <div className={`container${fullWidth ? "-full" : ""}`}>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={parentClass}>
        <div className={`container${fullWidth ? "-full" : ""}`}>
          <p>Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={parentClass}>
      <div className={`container${fullWidth ? "-full" : ""}`}>
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <h5 className="fw-semibold">Products Related To This Item</h5>
          <div className="d-flex relative">
            <div className="nav-swiper nav-prev-products snbp12">
              <ChevronLeft />
            </div>
            <div className="nav-swiper nav-next-products snbn12">
              <ChevronRight />
            </div>
          </div>
        </div>
        <Swiper
          className="swiper tf-sw-products"
          breakpoints={{
            0: { slidesPerView: 2 },
            575: { slidesPerView: 3 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            992: { slidesPerView: 5, spaceBetween: 30 },
          }}
          spaceBetween={15}
          modules={[Navigation, Pagination]}
          pagination={{
            clickable: true,
            el: ".spd12",
          }}
          navigation={{
            prevEl: ".snbp12",
            nextEl: ".snbn12",
          }}
          onInit={handleSwiperInit}
          onSlideChange={handleSlideChange}
        >
          {products.map((product) => (
            <SwiperSlide className="swiper-slide" key={product.id}>
              <div
                className={`card-product style-img-border wow ${
                  product.animation || ""
                }`}
                data-wow-delay={product.wowDelay || "0s"}
                data-wow-duration="0.8s"
              >
                <div className="card-product-wrapper">
                  <Link
                    href={`/${product.categories_SlugName}/${product.subcategory_SlugName}/${product.slugName}`}
                    className="product-img"
                  >
                    <Image
                      className="img-product lazyload"
                      src={product.imgSrc || "/images/product-placeholder/product-placeholder-image.png"}
                      alt="image-product"
                      width={product.imgWidth}
                      height={product.imgHeight}
                    />
                    <Image
                      className="img-hover lazyload"
                      src={product.imgHover || "/images/product-placeholder/product-placeholder-image.png"}
                      alt="image-product"
                      width={product.hoverWidth}
                      height={product.hoverHeight}
                    />
                  </Link>
                </div>
                <div className="card-product-info">
                  <div className="box-title">
                    <div className="d-flex flex-column">
                      <p className="caption text-main-2 font-2">
                        {product.category}, {product.subCategory}
                      </p>
                      <Link
                        href={`/${product.categories_SlugName}/${product.subcategory_SlugName}/${product.slugName}`}
                        className="name-product body-md-2 fw-semibold text-secondary link"
                      >
                        {product.title}
                      </Link>
                    </div>
                    <p className="price-wrap fw-medium">
                      <span className="new-price fw-medium">
                        {product.advance ? (
                          <span>
                            Rs. {product.advance.toLocaleString()}{" "}
                            <span className="text-primary">Advance</span>
                          </span>
                        ) : (
                          <span>Not Available</span>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="d-flex d-lg-none sw-dot-default sw-pagination-products justify-content-center spd12" />
        </Swiper>
      </div>
    </section>
  );
}