"use client";

import { useRouter } from "next/navigation";

export default function AddToCart({ productSlugName, tooltipClass = "" }) {

  const router = useRouter();
  
    const goToProduct = () => {
      router.push(`/product-detail/${productSlugName}`);
    };

  return (
    <>
      <a
        href="#"
        data-bs-toggle="offcanvas"
        onClick={goToProduct}
        className={`box-icon add-to-cart btn-icon-action hover-tooltip ${tooltipClass}`}
      >
        <span className="icon icon-cart2" />
        <span className="tooltip">
          Add to Cart
        </span>
      </a>
    </>
  );
}
