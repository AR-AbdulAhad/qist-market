"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "@/public/css/quill-out.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Description({ singleProduct, loading }) {
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const descriptionRef = useRef(null);

  const productID = loading ? null : singleProduct?.id;
  const MAX_HEIGHT = 150;

  useEffect(() => {
    if (!productID) return;
    setFaqLoading(true);
    axios
      .get(`${BACKEND_URL}/api/faqs/product/${productID}`)
      .then((res) => {
        setFaqs(res.data);
        setFaqLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
        setFaqs([]);
        setFaqLoading(false);
      });
  }, [productID]);

  useEffect(() => {
    if (descriptionRef.current && !loading && singleProduct?.long_description) {
      const contentHeight = descriptionRef.current.scrollHeight;
      setIsTruncated(contentHeight > MAX_HEIGHT);
    }
  }, [loading, singleProduct]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <section className="tf-sp-4">
      <div className="container">
        <div className="flat-animate-tab flat-title-tab-product-des">
          <div className="flat-title-tab text-center">
            <ul className="menu-tab-line" role="tablist">
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-des"
                  className="tab-link product-title fw-semibold active"
                  data-bs-toggle="tab"
                >
                  Description
                </a>
              </li>
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-review"
                  className="tab-link product-title fw-semibold"
                  data-bs-toggle="tab"
                >
                  Reviews (0)
                </a>
              </li>
              <li className="nav-tab-item" role="presentation">
                <a
                  href="#prd-faq"
                  className="tab-link product-title fw-semibold"
                  data-bs-toggle="tab"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div className="tab-content">
            {/* Description tab */}
            <div className="tab-pane active show" id="prd-des" role="tabpanel">
              <div className="tab-main">
                {loading ? (
                  <div className="w-100 d-flex justify-content-center align-items-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="position-relative">
                    <div
                      ref={descriptionRef}
                      className={`body-text-33 ${
                        isTruncated && !showFullDescription
                          ? "description-truncated"
                          : ""
                      }`}
                      style={{
                        maxHeight:
                          isTruncated && !showFullDescription
                            ? `${MAX_HEIGHT}px`
                            : "none",
                        overflow: isTruncated && !showFullDescription ? "hidden" : "visible",
                        position: "relative",
                        transition: "max-height 0.3s ease",
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          singleProduct?.long_description || "Data Not Found!",
                      }}
                    />
                    {isTruncated && singleProduct?.long_description && (
                      <div className="text-center mt-3">
                        <button
                          className="check-btn text-primary"
                          onClick={toggleDescription}
                        >
                          {showFullDescription ? "Show Less" : "Show More"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FAQs Tab */}
            <div className="tab-pane" id="prd-faq" role="tabpanel">
              <div className="tab-main tab-info">
                <div className="faq-wrap" id="accordionMyAcc">
                  {faqLoading ? (
                    <div className="w-100 d-flex justify-content-center align-items-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : faqs.length === 0 ? (
                    <p className="text-gray-500">No FAQs available.</p>
                  ) : (
                    faqs.map((faq, index) => (
                      <div
                        className="widget-accordion"
                        key={faq.id || index}
                        id={`heading${index}`}
                      >
                        <div
                          className="accordion-title collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapseMyAcc-${index}`}
                          aria-expanded="false"
                          aria-controls={`collapseMyAcc-${index}`}
                          role="button"
                        >
                          <span className="title-sidebar">
                            {`${index + 1}. ${faq.question}`}
                          </span>
                          <span className="icon" />
                        </div>
                        <div
                          id={`collapseMyAcc-${index}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading${index}`}
                          data-bs-parent="#accordionMyAcc"
                        >
                          <div className="accordion-body widget-material">
                            <p className="text-main">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Tab */}
            <div className="tab-pane" id="prd-review" role="tabpanel">
              <div className="tab-main tab-info">
                Review Coming Soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}