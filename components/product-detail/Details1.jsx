"use client";
import React, { useState } from "react";
import Slider1 from "./sliders/Slider1";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaLinkedinIn,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Details1({ singleProduct, loading }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const router = useRouter();

  const handleSelectChange = (e) => {
    const planId = e.target.value;
    setIsPlanLoading(true);
    const plan = singleProduct?.ProductInstallments?.find(
      (p) => p.id.toString() === planId
    );

    setTimeout(() => {
      setSelectedPlan(plan || null);
      setIsPlanLoading(false);
    }, 500);
  };

  const handleNext = () => {
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
        secure: true,
        sameSite: "Strict",
        path: "/",
      });

      router.push('/checkout');
    }
  };

  const productUrl = `/product/${singleProduct?.slugName}`;

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
                      <Skeleton height={652} />
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
                          <Skeleton width={200} height={20} />
                        ) : (
                          <p className="caption">
                            Categories:{" "}
                            <Link
                              href={`/product-category`}
                              className="link text-secondary"
                            >
                              {singleProduct.category_name}
                            </Link>
                            ,{" "}
                            <Link
                              href={`/product-category`}
                              className="link text-secondary"
                            >
                              {singleProduct.subcategory_name}
                            </Link>
                          </p>
                        )}
                        {loading ? (
                          <Skeleton width={350} height={25} />
                        ) : (
                          <h5 className="product-info-name fw-semibold d-flex flex-column gap-3">
                            {singleProduct.name}
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
                                href={`/shop-default`}
                                className="caption text-secondary link"
                              >
                                {singleProduct.brand}
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
                            {singleProduct.short_description}
                          </p>
                        )}
                      </div>

                      {/* Installment Dropdown */}
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
                                  {singleProduct?.ProductInstallments?.map((installment, index) => (
                                    <option key={installment.id} value={installment.id}>
                                      Plan {index + 1} - Rs {installment.monthlyAmount.toLocaleString()} x {installment.months} months
                                    </option>
                                  ))}
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
                                          <strong>Monthly:</strong> Rs {selectedPlan.monthlyAmount.toLocaleString()} x{" "}
                                          {selectedPlan.months} months
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
                            <div className="w-100 p-2">
                              {singleProduct.brand}
                            </div>
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
      </section>
    </>
  );
}