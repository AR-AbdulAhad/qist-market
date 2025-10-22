"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Quickview() {
  const { quickViewItem, closeModal } = useContextElement();
  const { settings } = useSettings();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const fetchProduct = async () => {
    if (!quickViewItem?.id) {
      console.error("No product ID provided for Quickview");
      setProductData(quickViewItem);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/product/${quickViewItem.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProductData({ ...quickViewItem, ...data });
    } catch (error) {
      console.error("Error fetching product:", error);
      setProductData(quickViewItem);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const modal = document.getElementById("quickView");
    if (modal) {
      const handleModalShow = () => {
        if (quickViewItem) {
          setProductData(null);
          setLoading(true);
          setSelectedPlan(null);
          setCurrentImageIndex(0);
          fetchProduct();
        } else {
          console.warn("quickViewItem is not available yet, waiting...");
          setLoading(true);
        }
      };

      const handleModalHide = () => {
        setProductData(null);
        setLoading(true);
        setSelectedPlan(null);
        setCurrentImageIndex(0);
      };

      modal.addEventListener("shown.bs.modal", handleModalShow);
      modal.addEventListener("hidden.bs.modal", handleModalHide);

      return () => {
        modal.removeEventListener("shown.bs.modal", handleModalShow);
        modal.removeEventListener("hidden.bs.modal", handleModalHide);
      };
    }
  }, [quickViewItem]);

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };

  const handleNext = () => {
    if (!selectedPlan) {
      toast.error("Please select a plan before proceeding.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (productData && selectedPlan) {
      const cartData = {
        productId: productData.id,
        productName: productData.title || productData.name,
        productSlug: productData.slugName,
        categories_SlugName: productData.categories_SlugName,
        subcategory_SlugName: productData.subcategory_SlugName,
        imageUrl: productData.imgSrc || productData.ProductImage?.[0]?.url,
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

      router.push("/checkout");
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? quickviewImages.length - 1 : prev - 1;
      return newIndex;
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === quickviewImages.length - 1 ? 0 : prev + 1;
      return newIndex;
    });
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCopy = async () => {
    const productUrl = `https://qistmarket.pk/${productData?.categories_SlugName || quickViewItem?.categories_SlugName}/${productData?.subcategory_SlugName || quickViewItem?.subcategory_SlugName}/${productData?.slugName || quickViewItem?.slugName || ""}`;
  
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


  const productUrl = `https://qistmarket.pk/${productData?.categories_SlugName || quickViewItem?.categories_SlugName}/${productData?.subcategory_SlugName || quickViewItem?.subcategory_SlugName}/${productData?.slugName || quickViewItem?.slugName || ""}`;
  const quickviewImages = productData?.ProductImage?.map((img) => img.url) || [productData?.imgSrc || quickViewItem?.imgSrc].filter(Boolean);

  if (!quickViewItem && !loading) {
    return (
      <div className="modal fade modalCentered modal-def modal-quick-view" id="quickView">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content flex-md-row">
            <span className="icon-close icon-close-popup link" data-bs-dismiss="modal" />
            <div className="container mb-5 mt-4 mx-2">
              <div className="text-center">
                <p>No product selected. Please try again.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal fade modalCentered modal-def modal-quick-view" id="quickView">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content flex-md-row model-release">
          <span className="icon-close icon-close-popup link" data-bs-dismiss="modal" />
          <div className="container mb-5 mt-4 mx-2">
            <div className="mb-3">
              <ul className="breakcrumbs">
                <li>
                  <Link href="/" className="body-small link">
                    Home
                  </Link>
                </li>
                <li className="d-flex align-items-center">
                  <i className="icon icon-arrow-right" />
                </li>
                <li>
                  <Link href="/shop" className="body-small link">
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
                      <div>{productData?.title || productData?.name || quickViewItem?.title || "Product Name"}</div>
                    )}
                  </span>
                </li>
              </ul>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="tf-product-media-wrap thumbs-default sticky-top">
                  <div className="thumbs-slider">
                    {loading ? (
                      <Skeleton height={600} />
                    ) : quickviewImages.length === 0 ? (
                      <div>
                        <Image
                          className="lazyload"
                          src="/images/product-placeholder/product-placeholder-image.png"
                          alt="Product Image"
                          width={600}
                          height={600}
                          priority
                        />
                      </div>
                    ) : quickviewImages.length === 1 ? (
                      <div className="single-image tf-product-media-main">
                        <Link
                          href={`/${productData?.categories_SlugName || quickViewItem?.categories_SlugName}/${productData?.subcategory_SlugName || quickViewItem?.subcategory_SlugName}/${productData?.slugName || quickViewItem?.slugName || ""}`}
                          className="d-block tf-image-view"
                        >
                          <Image
                            src={quickviewImages[0]}
                            alt="product-image"
                            className="lazyload"
                            width={600}
                            height={600}
                            priority
                            onError={() => console.error("Image failed to load:", quickviewImages[0])}
                          />
                        </Link>
                      </div>
                    ) : (
                      <div className="custom-slider">
                        <div className="main-image-container">
                          {quickviewImages.length > 1 && (
                            <>
                              <button
                                className="slider-nav prev"
                                onClick={handlePrevImage}
                                aria-label="Previous Image"
                              >
                                <span className="icon icon-arrow-right rotate-90" />
                              </button>
                              <button
                                className="slider-nav next"
                                onClick={handleNextImage}
                                aria-label="Next Image"
                              >
                                <span className="icon icon-arrow-right" />
                              </button>
                            </>
                          )}
                          <Link
                            href={`/${productData?.categories_SlugName || quickViewItem?.categories_SlugName}/${productData?.subcategory_SlugName || quickViewItem?.subcategory_SlugName}/${productData?.slugName || quickViewItem?.slugName || ""}`}
                            className="d-block tf-image-view"
                          >
                            <Image
                              src={quickviewImages[currentImageIndex]}
                              alt="product-image"
                              className="lazyload"
                              width={600}
                              height={600}
                              priority
                              onError={() => console.error("Image failed to load:", quickviewImages[currentImageIndex])}
                            />
                          </Link>
                        </div>
                        {quickviewImages.length > 1 && (
                          <div className="thumbnail-container">
                            {quickviewImages.map((elm, i) => (
                              <div
                                key={i}
                                className={`thumbnail-item ${i === currentImageIndex ? "active" : ""}`}
                                onClick={() => handleThumbnailClick(i)}
                              >
                                <Image
                                  src={elm}
                                  alt="thumbnail"
                                  width={100}
                                  height={100}
                                  onError={() => console.error("Thumbnail failed to load:", elm)}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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
                          <Skeleton width={350} height={25} />
                        ) : (
                          <h5 className="product-info-name fw-semibold d-flex flex-column gap-3">
                            {productData?.title || productData?.name || quickViewItem?.title || "Product Name"}
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
                              <button className="body-text-3 text-main-2 link border-0 bg-transparent p-0">
                                ({productData.approved_reviews_count} customer reviews)
                              </button>
                            </div>
                            {productData?.isDeal && (
                              <span data-wow-delay={0}>
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
                              <Link href="/shop" className="caption text-secondary link">
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
                            {productData?.short_description || quickViewItem?.short_description || "No Data Found!"}
                          </p>
                        )}
                      </div>

                      {loading ? (
                        <Skeleton height={100} />
                      ) : (
                        <>
                          {productData?.stock === false ? (
                            <div className="bg-primary p-1 text-center rounded my-3">
                              <span className="body-md-2 fw-medium text-white">Out of Stock</span>
                            </div>
                          ) : (
                            <div className="tf-product-info-choose-option mt-3">
                              <h5 className="product-info-name fw-semibold text-primary mb-3">
                                Select Your Installment Plan
                              </h5>
                              {productData?.ProductInstallments?.map((installment, index) => (
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
                                        className="form-check-label"
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
                              href={`/product-category/${productData?.category_slug_name || quickViewItem?.category_slug_name}`}
                              className="link text-secondary"
                            >
                              {productData?.category || quickViewItem?.category || productData?.category_name || quickViewItem?.category_name}
                            </Link>
                            ,{" "}
                            <Link
                              href={`/product-category/${productData?.category_slug_name || quickViewItem?.category_slug_name}/${productData?.subcategory_slug_name || quickViewItem?.subcategory_slug_name}`}
                              className="link text-secondary"
                            >
                              {productData?.subCategory || quickViewItem?.subCategory || productData?.subcategory_name || quickViewItem?.subcategory_name}
                            </Link>
                          </p>
                        )}
                        {loading ? (
                          <Skeleton width={200} height={20} />
                        ) : (
                          <p>
                            <strong>Tags:</strong>{" "}
                            {productData?.tags?.map((tag, index) => (
                              <span key={tag.id}>
                                <Link
                                  href={`/product-category/${tag.slugName}`}
                                  className="link text-secondary"
                                >
                                  {tag.name}
                                </Link>
                                {index < productData.tags.length - 1 && ", "}
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
      </div>
    </div>
  );
}