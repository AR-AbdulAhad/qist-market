'use client';
import ProductCard1 from "@/components/productCards/ProductCard1";
import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CountdownTimer from "../../common/CountdownTimer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Products1() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDealsProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/deals`);
        const data = await response.json();
        setDeals(data.filter((deal) => deal.isActive));
      } catch (error) {
        console.error("Error fetching deals:", error);
        setDeals([]);
      }
    };

    fetchDealsProducts();
  }, []);

  if (deals.length === 0) {
    return null;
  }

  const deal = deals[0];

  const getSlidesPerView = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth >= 992) return 4;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 575) return 2;
    return 1;
  };

  const shouldUseSlider = deal.products.length > getSlidesPerView();

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="flat-title pb-8 wow fadeInUp" data-wow-delay={0}>
          <h5 className="fw-semibold text-primary flat-title-has-icon deal-align">
            <div className="d-flex gap-2 align-items-center">
              <span className="icon">
                <i className="icon-fire tf-ani-tada" />
              </span>
              Deal Of The Day
            </div>
            <div className="d-flex gap-2 align-items-center">
              <span className="deal-dates ms-2">Ends in:</span>
              <span className="countdown-box ms-3">
                <CountdownTimer endDate={deal.endDate} />
              </span>
            </div>
          </h5>
        </div>
        <div className="box-btn-slide-2 sw-nav-effect">
          {shouldUseSlider ? (
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
                el: ".spd14",
              }}
              navigation={{
                prevEl: ".snbp14",
                nextEl: ".snbn14",
              }}
              watchOverflow={true}
            >
              {deal.products.map((product, index) => (
                <SwiperSlide className="swiper-slide" key={index}>
                  <ProductCard1 index={index} product={product} />
                </SwiperSlide>
              ))}
              <div className="sw-dot-default sw-pagination-products justify-content-center spd14" />
            </Swiper>
          ) : (
            <div className="non-slider-products d-flex flex-wrap">
              {deal.products.map((product, index) => (
                <div key={index} className="non-slider-product-item">
                  <ProductCard1 index={index} product={product} />
                </div>
              ))}
            </div>
          )}
          {shouldUseSlider && (
            <>
              <div className="d-none d-xl-flex swiper-button-prev nav-swiper nav-prev-products-2 snbp14">
                <i className="icon-arrow-left-lg" />
              </div>
              <div className="d-none d-xl-flex swiper-button-next nav-swiper nav-next-products-2 snbn14">
                <i className="icon-arrow-right-lg" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}