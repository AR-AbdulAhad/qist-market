"use client";
import React from "react";
import "@/public/css/features.css"

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM14 6H10V4H14V6ZM20 19H4V8H20V19Z" fill="#ff3d3d"/>
      </svg>
    ),
    title: "Complimentary Shipping",
    description: "Free delivery on all orders",
    delay: "0s",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#ff3d3d"/>
      </svg>
    ),
    title: "Easy Verification",
    description: "Quick and simple verification process",
    delay: "0.1s",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 7H3C1.89 7 1 7.89 1 9V17C1 18.11 1.89 19 3 19H21C22.11 19 23 18.11 23 17V9C23 7.89 22.11 7 21 7ZM21 17H3V9H21V17Z" fill="#ff3d3d"/>
      </svg>
    ),
    title: "No Bank Needed",
    description: "Shop without bank account/card",
    delay: "0.2s",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19ZM17 17H7V15H17V17Z" fill="#ff3d3d"/>
      </svg>
    ),
    title: "Zero Doc Fees",
    description: "No charges for documentation",
    delay: "0.3s",
  },
];

export default function Features({
  parentClass = "",
  hacontainer = true,
}) {
  return (
    <div className={parentClass}>
      <div className={hacontainer ? "container" : ""}>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              className="tf-icon-box tf-icon-boxs wow fadeInLeft"
              data-wow-delay={feature.delay}
              key={index}
            >
              <div className="icon-box icon-boxs">
                {feature.icon}
              </div>
              <div className="content contents">
                <p className="body-text body-text-3 fw-semibold">{feature.title}</p>
                <p className="body-text-3 body-text-33">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}