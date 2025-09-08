"use client";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM14 6H10V4H14V6ZM20 19H4V8H20V19Z" fill="currentColor"/>
      </svg>
    ),
    title: "Complimentary Shipping",
    description: "Free delivery on all orders",
    delay: "0s",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
      </svg>
    ),
    title: "Easy Verification",
    description: "Quick and simple verification process",
    delay: "0.1s",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 7H3C1.89 7 1 7.89 1 9V17C1 18.11 1.89 19 3 19H21C22.11 19 23 18.11 23 17V9C23 7.89 22.11 7 21 7ZM21 17H3V9H21V17Z" fill="currentColor"/>
      </svg>
    ),
    title: "No Bank Needed",
    description: "Shop without bank account/card",
    delay: "0.2s",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19ZM17 17H7V15H17V17Z" fill="currentColor"/>
      </svg>
    ),
    title: "Zero Doc Fees",
    description: "No charges for documentation",
    delay: "0.3s",
  },
];

export default function Features({
  parentClass = "tf-sp-2 pt-0",
  hacontainer = true,
}) {
  return (
    <div className={parentClass}>
      <div className={hacontainer ? "container" : ""}>
        <Swiper
          className="swiper tf-sw-iconbox"
          breakpoints={{
            0: { slidesPerView: 1 },
            575: { slidesPerView: 2 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 20 },
          }}
          modules={[Pagination]}
          pagination={{
            clickable: true,
            el: ".spd3",
          }}
        >
          {features.map((slide, index) => (
            <SwiperSlide className="swiper-slide" key={index}>
              <div
                className="tf-icon-box wow fadeInLeft"
                data-wow-delay={slide.delay}
              >
                <div className="icon-box">
                  {slide.icon}
                </div>
                <div className="content">
                  <p className="body-text fw-semibold">{slide.title}</p>
                  <p className="body-text-3">{slide.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="sw-pagination-iconbox sw-dot-default justify-content-center spd3" />
        </Swiper>
      </div>
    </div>
  );
}