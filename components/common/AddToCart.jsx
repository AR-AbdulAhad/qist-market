"use client";

import { useRouter } from "next/navigation";

export default function AddToCart({ productSlugName, categoriesSlugName, subcategorySlugName, tooltipClass = "" }) {

  const router = useRouter();
  
    const goToProduct = () => {
      router.push(`/${categoriesSlugName}/${subcategorySlugName}/${productSlugName}`);
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
