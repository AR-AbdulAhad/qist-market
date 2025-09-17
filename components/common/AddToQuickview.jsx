"use client";

import { useContextElement } from "@/context/Context";

export default function AddToQuickview({ product, tooltipClass = "" }) {
  const { setQuickViewItem, openModal } = useContextElement();

  const handleQuickViewClick = () => {
    if (!product || !product.id) {
      console.error("Invalid product passed to AddToQuickview:", product);
      return;
    }
    console.log("Setting quickViewItem:", product);
    setQuickViewItem(product);
    openModal("quickView");
  };

  return (
    <a
      href="#quickView"
      data-bs-toggle="modal"
      onClick={handleQuickViewClick}
      className={`box-icon quickview btn-icon-action hover-tooltip ${tooltipClass}`}
    >
      <span className="icon icon-view" />
      <span className="tooltip">Quick View</span>
    </a>
  );
}