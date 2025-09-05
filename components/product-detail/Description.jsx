import React from "react";
import Image from "next/image";
export default function Description({ singleProduct, loading }) {
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
            <div className="tab-pane active show" id="prd-des" role="tabpanel">
              <div className="tab-main">
                {loading ?
                <div className="w-100 d-flex justify-content-center align-items-center">
                    <div
                    className="spinner-border"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                :
                  <div className="body-text-3" dangerouslySetInnerHTML={{ __html: singleProduct.long_description || "Data Not Found!" }}></div>
                }
              </div>
            </div>
            <div className="tab-pane" id="prd-faq" role="tabpanel">
              <div className="tab-main tab-info">
                FAQ 
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
