"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);

  useEffect(() => {
    setFaqLoading(true);
    axios
      .get(`${BACKEND_URL}/api/qas/active`)
      .then((res) => {
        setFaqs(res.data);
        setFaqLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
        setFaqs([]);
        setFaqLoading(false);
      });
  }, []);

  return (
    <section>
      <div className="container">
        <div className="flat-title-tab text-center mb-5">
          <h1 className="display-4 text-center mb-5 fw-medium"><strong>Frequently Asked Questions</strong></h1>
        </div>
        <div className="mb-5 fre-text">
          <strong>Below are frequently asked questions, you may find the answer for yourself.</strong>
        </div>
        <div className="faq-wrap" id="accordionFaqs">
          {faqLoading ? (
            <div className="w-100 d-flex justify-content-center align-items-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : faqs.length === 0 ? (
            <p className="text-gray-500 text-center">No FAQs available.</p>
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
                  data-bs-target={`#collapseFaq-${index}`}
                  aria-expanded="false"
                  aria-controls={`collapseFaq-${index}`}
                  role="button"
                >
                  <span className="title-sidebar">
                    {`${index + 1}. ${faq.question}`}
                  </span>
                  <span className="icon" />
                </div>
                <div
                  id={`collapseFaq-${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#accordionFaqs"
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
    </section>
  );
}