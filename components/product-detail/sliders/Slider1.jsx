"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import Drift from "drift-zoom";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

export default function Slider1({ images }) {
  const [swiperThumb, setSwiperThumb] = useState(null);
  const lightboxRef = useRef(null);

  if (!images || images.length === 0) {
    return (
    <div>
      <Image
            className="tf-image-zoom lazyload"
            src='/images/product-placeholder/product-placeholder-image.png'
            data-zoom='/images/product-placeholder/product-placeholder-image.png'
            alt="Product Image"
            width={600}
            height={600}
            priority
          />
      </div>
    );
  }

  useEffect(() => {
    if (images && images.length > 0) {
      const lightbox = new PhotoSwipeLightbox({
        gallery: "#gallery-swiper-started",
        children: ".item",
        pswpModule: () => import("photoswipe"),
      });

      lightbox.init();
      lightboxRef.current = lightbox;

      return () => {
        lightbox.destroy();
      };
    }
  }, [images]);

  useEffect(() => {
    const checkWindowSize = () => window.innerWidth >= 1200;

    if (!checkWindowSize()) return;

    const initializeDrift = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom");
      const pane = document.querySelector(".tf-zoom-main");

      if (!pane) {
        console.warn("Retrying to find .tf-zoom-main element...");
        return false;
      }

      driftAll.forEach((el) => {
        new Drift(el, {
          zoomFactor: 2,
          paneContainer: pane,
          inlinePane: false,
          handleTouch: false,
          hoverBoundingBox: true,
          containInline: true,
        });
      });
      return true;
    };

    let attempts = 0;
    const maxAttempts = 5;
    const retryInterval = 500;

    const attemptDriftInitialization = () => {
      if (initializeDrift()) return;

      attempts += 1;
      if (attempts < maxAttempts) {
        setTimeout(attemptDriftInitialization, retryInterval);
      } else {
        console.error("Failed to initialize Drift: .tf-zoom-main not found after multiple attempts");
      }
    };

    attemptDriftInitialization();

    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.add("zoom-active");
      }
    };

    const handleMouseLeave = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.remove("zoom-active");
      }
    };

    zoomElements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      zoomElements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [images]);

  if (images && images.length === 1) {
    return (
      <div
        className="single-image swiper tf-product-media-main"
        id="gallery-swiper-started"
      >
        <a
          href={images[0].url}
          className="item"
          data-pswp-width="600px"
          data-pswp-height="600px"
        >
          <Image
            className="tf-image-zoom lazyload"
            src={images[0].url}
            data-zoom={images[0].url}
            alt="Product Image"
            width={600}
            height={600}
            priority
          />
        </a>
      </div>
    );
  }

  return (
    <>
      <Swiper
        className="swiper tf-product-media-main"
        id="gallery-swiper-started"
        thumbs={{ swiper: swiperThumb }}
        modules={[Thumbs]}
      >
        {images &&
          images.map((item, i) => (
            <SwiperSlide key={i} className="swiper-slide" data-color="gray">
              <a
                href={item.url}
                target="_blank"
                className="item"
                data-pswp-width="600px"
                data-pswp-height="600px"
              >
                <Image
                  className="tf-image-zoom lazyload"
                  src={item.url}
                  data-zoom={item.url}
                  alt="Product Image"
                  width={600}
                  height={600}
                  priority={i === 0}
                />
              </a>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="container-swiper">
        <Swiper
          className="swiper tf-product-media-thumbs other-image-zoom"
          modules={[Navigation, Thumbs]}
          onSwiper={setSwiperThumb}
          spaceBetween={10}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress={true}
          observer={true}
          observeParents={true}
          direction="horizontal"
          navigation={{
            nextEl: ".thumbs-next",
            prevEl: ".thumbs-prev",
          }}
          breakpoints={{
            0: { direction: "horizontal" },
            1200: { direction: "horizontal" },
          }}
        >
          {images &&
            images.map((item, index) => (
              <SwiperSlide
                key={index}
                className="swiper-slide stagger-item"
                data-color="gray"
              >
                <div className="item">
                  <Image
                    className="lazyload"
                    src={item.url}
                    alt="Product Thumbnail"
                    width={600}
                    height={600}
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  );
}