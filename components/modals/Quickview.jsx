"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Quickview() {
  const { quickViewItem, closeModal } = useContextElement();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
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
      console.log("API Response:", data);
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const productUrl = `https://qistmarket.pk/product-detail/${productData?.slugName || quickViewItem?.slugName || ""}`;
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
                      <Skeleton height={652} />
                    ) : quickviewImages.length === 0 ? (
                      <div>
                        <Image
                          className="lazyload"
                          src="/images/product-placeholder/product-placeholder-image.png"
                          alt="Product Image"
                          width={652}
                          height={652}
                          priority
                        />
                      </div>
                    ) : quickviewImages.length === 1 ? (
                      <div className="single-image tf-product-media-main">
                        <Link
                          href={`/product-detail/${productData?.slugName || quickViewItem?.slugName || ""}`}
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
                            href={`/product-detail/${productData?.slugName || quickViewItem?.slugName || ""}`}
                            className="d-block tf-image-view"
                          >
                            <Image
                              src={quickviewImages[currentImageIndex]}
                              alt="product-image"
                              className="lazyload"
                              width={652}
                              height={652}
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
                          <Skeleton width={200} height={20} />
                        ) : (
                          <p className="caption">
                            Categories:{" "}
                            <Link href="/product-category" className="link text-secondary">
                              {productData?.category || quickViewItem?.category || productData?.category_name || quickViewItem?.category_name ||  "Consumer Electronics"}
                            </Link>
                            {productData?.subCategory || quickViewItem?.subCategory || productData?.subcategory_name || quickViewItem?.subcategory_name ? (
                              <>
                                ,{" "}
                                <Link href="/product-category" className="link text-secondary">
                                  {productData?.subCategory || quickViewItem?.subCategory || productData?.subcategory_name || quickViewItem?.subcategory_name}
                                </Link>
                              </>
                            ) : null}
                          </p>
                        )}
                        {loading ? (
                          <Skeleton width={350} height={25} />
                        ) : (
                          <h5 className="product-info-name fw-semibold d-flex flex-column gap-3">
                            {productData?.title || productData?.name || quickViewItem?.title || "Product Name"}
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
                                Supplied and Shipped by {productData?.brand || quickViewItem?.brand || "Qist Market"}
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
                                <div key={installment.id} className="card mb-2">
                                  <div className="card-body">
                                    <div className="form-check">
                                      <input
                                        type="radio"
                                        className="form-check-input"
                                        id={`plan-${installment.id}`}
                                        name="installmentPlan"
                                        value={installment.id}
                                        checked={selectedPlan?.id === installment.id}
                                        onChange={() => handlePlanSelection(installment)}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`plan-${installment.id}`}
                                      >
                                        Plan {index + 1} - Rs {installment.monthlyAmount.toLocaleString()} x {installment.months} months
                                        <span style={{ color: "red" }}> Rs {installment.advance.toLocaleString()} Advance</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={handleNext}
                                className="tf-btn mt-2 w-100 text-white"
                                disabled={!selectedPlan}
                              >
                                Next
                              </button>
                            </div>
                          )}
                        </>
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
      <ToastContainer />
    </div>
  );
}