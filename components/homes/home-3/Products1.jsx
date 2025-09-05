"use client";

import { featuredProducts } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import CountdownTimer from "@/components/common/Countdown";
export default function Products1() {
  return (
    <section className="tf-sp-2 pt-xl-0">
      <div className="container">
        <div className="section-wrap wow fadeInUp" data-wow-delay="0s">
          <div className="flat-title">
            <h5 className="fw-semibold text-primary flat-title-has-icon">
              <span className="icon">
                <i className="icon-fire tf-ani-tada" />
              </span>
              Deal Of The Day
            </h5>
            <div className="box-btn-slide relative">
              <div className="swiper-button-prev nav-swiper nav-prev-products snbp35">
                <i className="icon-arrow-left-lg" />
              </div>
              <div className="swiper-button-next nav-swiper nav-next-products snbn35">
                <i className="icon-arrow-right-lg" />
              </div>
            </div>
          </div>
          <Swiper
            className="swiper tf-sw-products"
            spaceBetween={15}
            breakpoints={{
              0: { slidesPerView: 1 },
              575: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              992: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
            }}
            modules={[Navigation, Pagination]}
            pagination={{
              clickable: true,
              el: ".spd35",
            }}
            navigation={{
              prevEl: ".snbp35",
              nextEl: ".snbn35",
            }}
          >
            {featuredProducts.map((product) => (
              <SwiperSlide key={product.id} className="swiper-slide">
                <div className="card-product style-img-border style-row type-row-2 flex-lg-row">
                  <div className="card-product-wrapper">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="product-img"
                    >
                      <Image
                        className="img-product lazyload"
                        src={product.imgSrc}
                        alt="image-product"
                        width={product.width}
                        height={product.height}
                      />
                      <Image
                        className="img-hover lazyload"
                        src={product.imgHover}
                        alt="image-product"
                        width={product.width}
                        height={product.height}
                      />
                    </Link>
                    <div className="box-sale-wrap pst-default z-5">
                      <p className="small-text">Sale</p>
                      <p className="title-sidebar-2">
                        {product.salePercentage}%
                      </p>
                    </div>
                  </div>
                  <div className="card-product-info gap-xxl-51">
                    <div className="box-title">
                      <div className="bg-white relative z-5">
                        <p className="caption text-main-2 font-2">
                          {product.category}
                        </p>
                        <Link
                          href={`/product-detail/${product.id}`}
                          className="name-product product-title fw-semibold text-secondary link"
                        >
                          {product.title}
                        </Link>
                      </div>
                      <p className="price-wrap fw-medium">
                        <span className="new-price price-text fw-medium text-primary mb-0">
                          ${product.price.toFixed(3)}
                        </span>
                        <span className="old-price body-md-2 text-main-2 fw-normal">
                          ${product.oldPrice.toFixed(3)}
                        </span>
                      </p>
                    </div>
                    <div className="box-infor-detail">
                      <div className="product-progress-sale gap-0">
                        <div className="box-quantity d-flex justify-content-between">
                          <p className="text-avaiable body-small">
                            Availavle:{" "}
                            <span className="fw-bold">{product.available}</span>
                          </p>
                          <p className="text-avaiable body-small">
                            Sold:{" "}
                            <span className="fw-bold">{product.sold}</span>
                          </p>
                        </div>
                        <div
                          className="progress-sold progress style-3"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="progress-bar bg-primary"
                            style={{ width: product.progressWidth }}
                          />
                        </div>
                      </div>
                      <div className="countdown-box d-flex gap-10 flex-wrap">
                        <div className="d-flex gap-10 flex-xxl-column gap-xxl-0">
                          <h6 className="fw-semibold">Hurry Up</h6>
                          <p className="body-small text-main-2">
                            offer ends in:
                          </p>
                        </div>
                        <div
                          className="js-countdown"
                          data-timer={product.countdownTimer}
                          data-labels="Days,Hours,Mins,Secs"
                        >
                          <CountdownTimer style={2} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="d-flex d-xl-none sw-dot-default sw-pagination-products justify-content-center spd35" />
          </Swiper>
        </div>
      </div>
    </section>
  );
}
