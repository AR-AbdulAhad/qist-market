"use client";
import React, { useState } from "react";
import Slider1 from "./sliders/Slider1";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaFacebookF,
  FaWhatsapp,
  FaLinkedinIn,
  FaPinterest,
  FaCheck,
} from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiTwitterXFill } from "react-icons/ri";
import { LuMail } from "react-icons/lu";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import Image from "next/image";

export default function Details1({ singleProduct, loading }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();
  const { settings } = useSettings();

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };

  const handleNext = () => {
    if (!selectedPlan) {
      toast.error("Please select a plan before proceeding.");
      return;
    }

    if (singleProduct && selectedPlan) {
      const cartData = {
        productId: singleProduct.id,
        productName: singleProduct.name,
        productSlug: singleProduct.slugName,
        imageUrl: singleProduct.ProductImage?.[0]?.url,
        selectedPlan: {
          id: selectedPlan.id,
          totalPrice: selectedPlan.totalPrice,
          monthlyAmount: selectedPlan.monthlyAmount,
          months: selectedPlan.months,
          advance: selectedPlan.advance,
        },
      };

      Cookies.set("cartData", JSON.stringify(cartData), {
        expires: 7,
        path: "/",
      });

      router.push('/checkout');
    }
  };

  const handleCopy = async () => {
  const productUrl = `https://qistmarket.pk/product-detail/${singleProduct?.slugName}`;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(productUrl);
        setIsCopied(true);
        toast.success("URL copied to clipboard");
        setTimeout(() => setIsCopied(false), 3000);
      } catch (err) {
        fallbackCopy(productUrl);
      }
    } else {
      fallbackCopy(productUrl);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-999px";
    textArea.style.left = "-999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setIsCopied(true);
        toast.success("URL copied to clipboard");
        setTimeout(() => setIsCopied(false), 3000);
      } else {
        toast.error("Failed to copy URL");
      }
    } catch (err) {
      toast.error("Failed to copy URL");
    }
    document.body.removeChild(textArea);
  };

  const productUrl = `https://qistmarket.pk/product-detail/${singleProduct?.slugName}`;

  return (
    <>
      <div className="tf-sp-1">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href={`/`} className="body-small link">
                Home
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <Link href={`/shop`} className="body-small link">
                Shop
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">
                {loading ? (
                  <Skeleton width={200} height={15} />
                ) : (
                  <div>{singleProduct.name} Price in Pakistan</div>
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <section>
        <div className="tf-main-product section-image-zoom">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="tf-product-media-wrap thumbs-default sticky-top">
                  <div className="thumbs-slider">
                    {loading ? (
                      <Skeleton height={600} />
                    ) : (
                      <Slider1 images={singleProduct.ProductImage} />
                    )}
                  </div>
                  <div className="tf-zoom-main"></div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="tf-product-info-wrap position-relative">
                  <div className="tf-product-info-list other-image-zoom">
                    <div className="tf-product-info-content w-100">
                      <div className="infor-heading">
                        {loading ? (
                          <Skeleton width={350} height={50} />
                        ) : (
                          <h5 className="product-info-name fw-semibold d-flex flex-column gap-3">
                            {singleProduct.name}
                            <div className="d-flex align-items-center gap-1 text-main-2">
                              <div className="d-flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  fill="#f59e0b"
                                  stroke="#f59e0b"
                                  strokeWidth="1.5"
                                  className="cursor-pointer"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.346l5.518.444a.562.562 0 01.312.986l-4.19 3.67a.563.563 0 00-.182.557l1.24 5.385a.562.562 0 01-.84.61l-4.725-2.86a.563.563 0 00-.586 0l-4.725 2.86a.562.562 0 01-.84-.61l1.24-5.386a.563.563 0 00-.182-.556l-4.19-3.67a.562.562 0 01.312-.986l5.518-.444a.563.563 0 00.475-.346L11.48 3.5z"
                                  />
                                </svg>
                              ))}
                            </div>
                              <button className="body-text-3 text-main-2 link border-0 bg-transparent p-0"
                              
                              onClick={() => {
                              const reviewsTab = document.querySelector('a[href="#prd-review"]');
                              if (reviewsTab) {
                                reviewsTab.click();
                                setTimeout(() => {
                                  const reviewsSection = document.getElementById('prd-review');
                                  if (reviewsSection) {
                                    reviewsSection.scrollIntoView({ 
                                      behavior: 'smooth',
                                      block: 'start'
                                    });
                                  }
                                  setTimeout(() => {
                                    const reviewAccordion = document.getElementById('collapseReview');
                                    const accordionButton = document.querySelector('[data-bs-target="#collapseReview"]');
                                    
                                    if (reviewAccordion && accordionButton) {
                                      accordionButton.classList.remove('collapsed');
                                      accordionButton.setAttribute('aria-expanded', 'true');
                                    
                                      reviewAccordion.classList.add('show');
                                      
                                      const bsCollapse = bootstrap.Collapse.getInstance(reviewAccordion) || 
                                                      new bootstrap.Collapse(reviewAccordion);
                                      bsCollapse.show();
                                    }
                                  }, 500);
                                }, 100);
                              }
                            }}

                            >({singleProduct.approved_reviews_count} customer reviews)</button>
                            </div>
                            {singleProduct.isDeal && (
                              <span className="" data-wow-delay={0}>
                                <h5 className="fw-semibold fs-5 text-primary flat-title-has-icon">
                                  <span className="icon">
                                    <i className="icon-fire tf-ani-tada" />
                                  </span>
                                  Deal Of The Day
                                </h5>
                              </span>
                            )}
                          </h5>
                        )}
                        <ul className="product-info-rate-wrap">
                          <li className="d-flex">
                            {loading ? (
                              <Skeleton width={200} height={15} />
                            ) : (
                              <Link
                                href={`/shop`}
                                className="caption text-secondary link"
                              >
                                Supplied and Shipped by
                                <Image
                                  src={settings?.logo_url}
                                  alt={settings?.name || "Qist Market"}
                                  width={80}
                                  height={30}
                                  className="ms-2"
                                />
                              </Link>
                            )}
                          </li>
                        </ul>
                      </div>
                      <div className="infor-bottom">
                        {loading ? (
                          <Skeleton height={100} />
                        ) : (
                          <p className="body-text-3">
                            {singleProduct.short_description || "Data Not Found!"}
                          </p>
                        )}
                      </div>

                      {/* Installment Radio Buttons */}
                      {loading ? (
                        <Skeleton height={100} />
                      ) : (
                        <>
                          {singleProduct?.stock === false ? (
                            <div className="bg-primary p-1 text-center rounded my-3">
                              <span className="body-md-2 fw-medium text-white">Out of Stock</span>
                            </div>
                          ) : (
                            <div className="tf-product-info-choose-option mt-3">
                              <h5 className="product-info-name fw-semibold text-primary mb-3">
                                Select Your Installment Plan
                              </h5>
                              {singleProduct?.ProductInstallments?.map((installment, index) => (
                                <label key={installment.id} className="card" htmlFor={`plan-${installment.id}`}>
                                  <div className="card-body rounded plan-hover-effect">
                                    <div className="form-check d-flex align-items-center gap-3 body-text-3">
                                      <input
                                        type="radio"
                                        className="form-check-input"
                                        id={`plan-${installment.id}`}
                                        name="installmentPlan"
                                        value={installment.id}
                                        checked={selectedPlan?.id === installment.id}
                                        onChange={() => handlePlanSelection(installment)}
                                      />
                                      <div
                                        className="form-check-label d-flex flex-column gap-1"
                                      >
                                        <div><strong>Plan {index + 1}</strong></div>
                                        <div><strong>Rs {installment.monthlyAmount.toLocaleString()}</strong> x {installment.months} months</div>
                                        <div><strong>Rs {installment.advance.toLocaleString()} <span className="text-primary">Advance</span></strong></div>
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              ))}
                              <button
                                onClick={handleNext}
                                className="tf-btn mt-2 w-100 text-white"
                              >
                                Order Now
                              </button>
                            </div>
                          )}
                        </>
                      )}
                      <div className="mt-3 d-flex flex-column gap-2">
                        {loading ? (
                          <Skeleton width={200} height={20} />
                        ) : (
                          <p>
                            <strong>Categories:</strong>{" "}
                            <Link
                              href={`/product-category/${singleProduct.category_slug_name}`}
                              className="link text-secondary"
                            >
                              {singleProduct.category_name}
                            </Link>
                            ,{" "}
                            <Link
                              href={`/product-category/${singleProduct.category_slug_name}/${singleProduct.subcategory_slug_name}`}
                              className="link text-secondary"
                            >
                              {singleProduct.subcategory_name}
                            </Link>
                          </p>
                        )}
                        {loading ? (
                          <Skeleton width={200} height={20} />
                        ) : (
                          <p>
                            <strong>Tags:</strong>{" "}
                            {singleProduct?.tags?.map((tag, index) => (
                              <span key={tag.id}>
                                <Link
                                  href={`/product-category/${tag.slugName}`}
                                  className="link text-secondary"
                                >
                                  {tag.name}
                                </Link>
                                {index < singleProduct.tags.length - 1 && ", "}
                              </span>
                            ))}
                          </p>
                        )}
                        {loading ? (
                          <div className="d-flex gap-3 mt-3 align-items-center flex-wrap">
                            <Skeleton width={40} height={40} circle />
                            <Skeleton width={40} height={40} circle />
                            <Skeleton width={40} height={40} circle />
                            <Skeleton width={40} height={40} circle />
                            <Skeleton width={40} height={40} circle />
                            <Skeleton width={40} height={40} circle />
                            <Skeleton width={40} height={40} circle />
                          </div>
                        ) : (
                          <div className="d-flex gap-2 mt-3 align-items-center">
                            <strong>Share:</strong>
                            <div className="d-flex gap-2 flex-wrap align-items-center"> 
                                <a
                                href={`https://facebook.com/sharer/sharer.php?u=${productUrl}`}
                                target="_blank"
                                className="text-white rounded-circle border share-icon-con d-flex justify-content-center align-items-center" style={{backgroundColor: '#365493'}}
                              >
                                <FaFacebookF size={15} />
                              </a>
                              <a
                                href={`https://x.com/share?url=${productUrl}`}
                                target="_blank"
                                className="text-white rounded-circle border share-icon-con d-flex justify-content-center align-items-center" style={{backgroundColor: '#000000'}}
                              >
                                <RiTwitterXFill size={15} />
                              </a>
                              <a
                                href={`mailto:?subject=Check This ${productUrl}`}
                                target="_blank"
                                className="text-white rounded-circle border share-icon-con d-flex justify-content-center align-items-center" style={{backgroundColor: '#f89a1e'}}
                              >
                                <LuMail size={15} />
                              </a>
                              <a
                                href={`https://pinterest.com/pin/create/button/?url=${productUrl}`}
                                target="_blank"
                                className="text-white rounded-circle border share-icon-con d-flex justify-content-center align-items-center" style={{backgroundColor: '#cb2027'}}
                              >
                                <FaPinterest size={15} />
                              </a>
                              <a
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${productUrl}`}
                                target="_blank"
                                className="text-white rounded-circle border share-icon-con d-flex justify-content-center align-items-center" style={{backgroundColor: '#0274b3'}}
                              >
                                <FaLinkedinIn size={15} />
                              </a>
                              <a
                                href={`https://api.whatsapp.com/send?text=${productUrl}`}
                                target="_blank"
                                className="text-white rounded-circle border share-icon-con d-flex justify-content-center align-items-center" style={{backgroundColor: '#1ebea5'}}
                              >
                                <FaWhatsapp size={15} />
                              </a>
                               <div
                                onClick={handleCopy}
                                className="text-white rounded-circle border share-icon-con d-flex justify-content-center align-items-center cursor-pointer"
                                style={{backgroundColor: '#000000'}}
                              >
                                {isCopied ? <FaCheck size={15} /> : <MdOutlineContentCopy size={15} />}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}