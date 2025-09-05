import React from "react";
import Link from "next/link";
import Image from "next/image";
export default function Banner3() {
  return (
    <div>
      <Link
        href={`/shop-default`}
        className="image wow fadeInUp radius-8 overflow-hidden"
        data-wow-delay="0s"
      >
        <Image
          src="/images/section/product-7.jpg"
          alt=""
          className="lazyload"
          width={1764}
          height={375}
        />
      </Link>
    </div>
  );
}
