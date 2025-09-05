import React from "react";
import Image from "next/image";
export default function Banner() {
  return (
    <div>
      <a href="#" className="d-block wow fadeInUp" data-wow-delay="0s">
        <Image
          src="/images/section/product-5.jpg"
          alt=""
          className="lazyload"
          width={568}
          height={860}
        />
      </a>
    </div>
  );
}
