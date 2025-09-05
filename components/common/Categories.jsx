"use client";
import { categories3 } from "@/data/collections";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { Pagination } from "swiper/modules";
export default function Categories({ parentClass = "" }) {
  return (
    <section className={parentClass}>
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <h5 className="fw-semibold">Product Category</h5>
          <div className="box-btn-slide relative">
            <div className="swiper-button-prev nav-swiper nav-prev-products">
              <i className="icon-arrow-left-lg" />
            </div>
            <div className="swiper-button-next nav-swiper nav-next-products">
              <i className="icon-arrow-right-lg" />
            </div>
          </div>
        </div>
        <div
          className="box-btn-slide-2 sw-nav-effect wow fadeInUp"
          data-wow-delay="0s"
        >
          <Swiper
            className="swiper tf-sw-products slider-category"
            breakpoints={{
              0: { slidesPerView: 2 },
              575: {
                slidesPerView: 4,
              },
              768: {
                slidesPerView: 7,
              },
              992: {
                slidesPerView: 10,
              },
            }}
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".spd2",
            }}
          >
            {categories3.map((item, index) => (
              <SwiperSlide className="swiper-slide" key={index}>
                <div className="wg-cls-2 hover-img">
                  <Link
                    href={`/shop-default`}
                    className="image img-style-2 overflow-visible"
                  >
                    <span className="tf-overlay" />
                    <Image src={item.imgSrc} alt="" width={296} height={296} />
                  </Link>
                  <Link href={`/shop-default`} className="link body-text-3">
                    {item.title}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
            <div className="d-flex d-xl-none sw-dot-default sw-pagination-products justify-content-center spd2" />
          </Swiper>
        </div>
      </div>
    </section>
  );
}
