"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Quickview() {
  const { quickViewItem } = useContextElement();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/product/${quickViewItem.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      setProductData(data);
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
        setProductData(null);
        setLoading(true);
        setSelectedPlan(null);
        setIsPlanLoading(false);
        setCurrentImageIndex(0);
        if (quickViewItem?.id) {
          fetchProduct();
        }
      };

      modal.addEventListener("shown.bs.modal", handleModalShow);
      return () => {
        modal.removeEventListener("shown.bs.modal", handleModalShow);
      };
    }
  }, [quickViewItem]);

  const handleSelectChange = (e) => {
    const planId = e.target.value;
    setIsPlanLoading(true);
    const plan = productData?.ProductInstallments?.find(
      (p) => p.id.toString() === planId
    );

    setTimeout(() => {
      setSelectedPlan(plan || null);
      setIsPlanLoading(false);
    }, 500);
  };

  const handleNext = () => {
      if (productData && selectedPlan) {
        const cartData = {
          productId: productData.id,
          productName: productData.name,
          productSlug: productData.slugName,
          imageUrl: productData.ProductImage?.[0]?.url,
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
          secure: true,
          sameSite: "Strict",
          path: "/",
        });
  
        router.push('/checkout');
      }
    };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? quickviewImages.length - 1 : prev - 1;
      console.log("Previous image, new index:", newIndex);
      return newIndex;
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === quickviewImages.length - 1 ? 0 : prev + 1;
      console.log("Next image, new index:", newIndex);
      return newIndex;
    });
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    console.log("Thumbnail clicked, new index:", index);
  };

  const productUrl = `http://localhost:3000/product/${productData?.slugName}`;
  const quickviewImages = productData?.ProductImage?.map((img) => img.url) || [];

  return (
    <div className="modal fade modalCentered modal-def modal-quick-view" id="quickView">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content flex-md-row">
          <span className="icon-close icon-close-popup link" data-bs-dismiss="modal" />
          <div className="container mb-5 mt-4 mx-2">
            {/* Breadcrumbs */}
            <div className="mb-3">
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
                      <div>{productData?.name || quickViewItem.title || "Product Name"}</div>
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
                      <Skeleton height={652} />
                    ) : quickviewImages.length === 0 ? (
                      <div>No images available</div>
                    ) : quickviewImages.length === 1 ? (
                      <div className="single-image tf-product-media-main">
                        <Link
                          href={`/product-detail/${productData?.slugName || quickViewItem.id}`}
                          className="d-block tf-image-view"
                        >
                          <Image
                            src={quickviewImages[0]}
                            alt="product-image"
                            className="lazyload"
                            width={652}
                            height={652}
                            priority
                            onError={() => console.error("Image failed to load:", quickviewImages[0])}
                          />
                        </Link>
                      </div>
                    ) : (
                      <div className="custom-slider">
                        {/* Main Image */}
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
                            href={`/product-detail/${productData?.slugName || quickViewItem.id}`}
                            className="d-block tf-image-view"
                          >
                            <Image
                              src={quickviewImages[currentImageIndex]}
                              alt="product-image"
                              className="lazyload main-image"
                              width={652}
                              height={652}
                              priority
                              onError={() => console.error("Image failed to load:", quickviewImages[currentImageIndex])}
                            />
                          </Link>
                        </div>
                        {/* Thumbnails */}
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

              {/* Rest of the component */}
              <div className="col-md-6">
                <div className="tf-product-info-wrap position-relative">
                  <div className="tf-product-info-list other-image-zoom">
                    <div className="tf-product-info-content w-100">
                      <div className="infor-heading">
                        {loading ? (
                          <Skeleton width={200} height={20} />
                        ) : (
                          <p className="caption">
                            Categories:{" "}
                            <Link href={`/product-category`} className="link text-secondary">
                              {productData?.categories?.name || "Consumer Electronics"}
                            </Link>
                            {productData?.subcategories?.name && (
                              <>
                                ,{" "}
                                <Link href={`/product-category`} className="link text-secondary">
                                  {productData.subcategories.name}
                                </Link>
                              </>
                            )}
                          </p>
                        )}
                        {loading ? (
                          <Skeleton width={350} height={25} />
                        ) : (
                          <h5 className="product-info-name fw-semibold">
                            {productData?.name || quickViewItem.title || "Product Name"}
                          </h5>
                        )}
                        <ul className="product-info-rate-wrap">
                          <li className="d-flex">
                            {loading ? (
                              <Skeleton width={200} height={15} />
                            ) : (
                              <Link href={`/shop-default`} className="caption text-secondary link">
                                {productData?.brand || "Brand Name"}
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
                            {productData?.short_description || quickViewItem.short_description || "No description available"}
                          </p>
                        )}
                      </div>

                      {/* Installment Dropdown */}
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
                            Choose Your Payment Plan
                          </h5>

                          <select
                            className="form-select"
                            onChange={handleSelectChange}
                            value={selectedPlan?.id || ""}
                            aria-label="Select a payment plan"
                          >
                            <option value="" disabled>
                              -- Select a Plan --
                            </option>
                            {productData?.ProductInstallments?.length > 0 ? (
                              productData.ProductInstallments.map((installment, index) => (
                                <option key={installment.id} value={installment.id}>
                                  Plan {index + 1} - Rs {installment.monthlyAmount.toLocaleString()} x {installment.months} months
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                No plans available
                              </option>
                            )}
                          </select>

                          {isPlanLoading ? (
                            <div className="card mt-2">
                              <div className="card-body text-center">
                                <div className="spinner-border" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            selectedPlan && (
                              <div className="card mt-2">
                                <div className="card-body">
                                  <h6 className="product-info-name mb-3">Selected Plan Details</h6>
                                  <p className="mb-1">
                                    <strong>Total Price:</strong> Rs {selectedPlan.totalPrice.toLocaleString()}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Monthly:</strong> Rs {selectedPlan.monthlyAmount.toLocaleString()} x {selectedPlan.months} months
                                  </p>
                                  <p className="mb-1">
                                    <strong>Advance:</strong> Rs {selectedPlan.advance.toLocaleString()}
                                  </p>
                                  <button
                                    onClick={handleNext}
                                    className="tf-btn mt-2 w-100 text-white"
                                    disabled={!selectedPlan}
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                        )}
                      </>
                      )}

                      {/* Brand + Share */}
                      {loading ? (
                        <Skeleton height={100} />
                      ) : (
                        <div className="border rounded mt-3">
                          <div className="border-bottom p-3">
                            <strong>More Information</strong>
                          </div>
                          <div className="border mt-3 mx-3 d-flex justify-content-between">
                            <div className="w-100 border-end p-2">
                              <strong>Brand</strong>
                            </div>
                            <div className="w-100 p-2">{productData?.brand || "Brand Name"}</div>
                          </div>
                        </div>
                      )}
                      <div className="mt-3">
                        {loading ? (
                          <Skeleton width={150} height={20} />
                        ) : (
                          <strong>Share This Product</strong>
                        )}
                        {loading ? (
                          <div className="d-flex gap-3 mt-3">
                            <Skeleton width={40} height={40} circle />
                            <Skeleton width={40} height={40} circle />
                            <Skeleton width={40} height={40} circle />
                            <Skeleton width={40} height={40} circle />
                          </div>
                        ) : (
                          <div className="d-flex gap-3 mt-3">
                            <a
                              href={`https://facebook.com/sharer/sharer.php?u=${productUrl}`}
                              target="_blank"
                              className="text-primary rounded-circle border px-2 py-2 d-flex justify-content-center align-items-center"
                            >
                              <FaFacebookF />
                            </a>
                            <a
                              href={`https://twitter.com/intent/tweet?url=${productUrl}`}
                              target="_blank"
                              className="text-primary rounded-circle border px-2 py-1 d-flex justify-content-center align-items-center"
                            >
                              <FaTwitter />
                            </a>
                            <a
                              href={`https://api.whatsapp.com/send?text=${productUrl}`}
                              target="_blank"
                              className="text-primary rounded-circle border px-2 py-1 d-flex justify-content-center align-items-center"
                            >
                              <FaWhatsapp />
                            </a>
                            <a
                              href={`https://www.linkedin.com/shareArticle?mini=true&url=${productUrl}`}
                              target="_blank"
                              className="text-primary rounded-circle border px-2 py-1 d-flex justify-content-center align-items-center"
                            >
                              <FaLinkedinIn />
                            </a>
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