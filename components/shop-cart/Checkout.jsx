"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const [cartData, setCartData] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedCity, setSelectedCity] = useState("Select");
  const [areas, setAreas] = useState([]);
  const router = useRouter();

  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const cnicRef = useRef(null);
  const cityRef = useRef(null);
  const areaRef = useRef(null);
  const addressRef = useRef(null);

  const cityAreaMap = {
    Alabam: ["Downtown Alabam", "Alabam Suburbs", "North Alabam"],
    Alaska: ["Anchorage", "Fairbanks", "Juneau"],
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Georgia: ["Atlanta", "Savannah", "Augusta"],
    Washington: ["Seattle", "Spokane", "Tacoma"],
  };

  const updateCartData = () => {
    try {
      const data = Cookies.get("cartData");
      if (data) {
        setCartData(JSON.parse(data));
      } else {
        setCartData(null);
      }
    } catch (error) {
      console.error("Error parsing cartData cookie:", error);
      setCartData(null);
    }
  };

  useEffect(() => {
    updateCartData();

    const intervalId = setInterval(() => {
      updateCartData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const data = Cookies.get("cartData");
    if (!data) {
      router.push("/shop-cart");
    }
  }, [router]);

  const removeItem = () => {
    Cookies.remove("cartData", { path: "/" });
    setCartData(null);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city === "Select" || !cityAreaMap[city]) {
      setAreas([]);
      areaRef.current.value = "Select";
    } else {
      setAreas(cityAreaMap[city]);
      areaRef.current.value = "Select";
    }
    validateField("city", city);
    setErrors((prev) => ({ ...prev, area: null }));
  };

  const validateField = (fieldName, value) => {
    let error = null;
    switch (fieldName) {
      case "email":
        if (!value || !/\S+@\S+\.\S+/.test(value)) {
          error = "A valid email is required";
        }
        break;
      case "phone":
        if (!value || !/^\d{10,}$/.test(value)) {
          error = "A valid phone number (minimum 10 digits) is required";
        }
        break;
      case "firstName":
        if (!value) {
          error = "First name is required";
        }
        break;
      case "lastName":
        if (!value) {
          error = "Last name is required";
        }
        break;
      case "cnic":
        if (!value || !/^\d{13}$/.test(value)) {
          error = "A valid 13-digit CNIC number is required";
        }
        break;
      case "city":
        if (!value || value === "Select") {
          error = "City selection is required";
        }
        break;
      case "area":
        if (!value || value === "Select") {
          error = "Area selection is required";
        }
        break;
      case "address":
        if (!value) {
          error = "Address is required";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "A valid email is required";
    }
    if (!formData.phone || !/^\d{10,}$/.test(formData.phone)) {
      newErrors.phone = "A valid phone number (minimum 10 digits) is required";
    }
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.cnic || !/^\d{13}$/.test(formData.cnic)) {
      newErrors.cnic = "A valid 13-digit CNIC number is required";
    }
    if (!formData.city || formData.city === "Select") {
      newErrors.city = "City selection is required";
    }
    if (!formData.area || formData.area === "Select") {
      newErrors.area = "Area selection is required";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    return newErrors;
  };

  const handlePlaceOrder = async (e) => {
  e.preventDefault();
  const formData = {
    email: emailRef.current.value,
    phone: phoneRef.current.value,
    firstName: firstNameRef.current.value,
    lastName: lastNameRef.current.value,
    cnic: cnicRef.current.value,
    city: cityRef.current.value,
    area: areaRef.current.value,
    address: addressRef.current.value,
    orderNotes: document.querySelector("textarea").value,
    paymentMethod: "Advance cash on delivery",
    productDetails: cartData
      ? {
          productName: cartData.productName,
          plan: {
            totalDealValue: cartData.selectedPlan.totalPrice,
            advanceAmount: cartData.selectedPlan.advance,
            monthlyAmount: cartData.selectedPlan.monthlyAmount,
            months: cartData.selectedPlan.months,
          },
        }
      : null,
  };

  const newErrors = validateForm(formData);
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    const firstErrorField = Object.keys(newErrors)[0];
    const fieldRefs = {
      email: emailRef,
      phone: phoneRef,
      firstName: firstNameRef,
      lastName: lastNameRef,
      cnic: cnicRef,
      city: cityRef,
      area: areaRef,
      address: addressRef,
    };
    fieldRefs[firstErrorField]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    return;
  }

  try {
    const response = await fetch('https://qistbackend-1.onrender.com/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const orderData = await response.json();
      console.log('Created Order:', orderData);
      // router.push("/order-details");
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData);
      setErrors({ api: errorData.error || 'Failed to create order', details: errorData.details });
    }
  } catch (error) {
    console.error('Network error:', error);
    setErrors({ api: 'Failed to connect to the server', details: error.message });
  }
};

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="checkout-status tf-sp-2 pt-0">
          <div className="checkout-wrap">
            <span className="checkout-bar next" />
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-1" />
              </span>
              <Link href={`/shop-cart`} className="link body-text-3">
                Shopping Cart
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-2" />
              </span>
              <Link href={`/checkout`} className="text-secondary link body-text-3">
                Shopping &amp; Checkout
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-3" />
              </span>
              <Link href={`/order-details`} className="link body-text-3">
                Confirmation
              </Link>
            </div>
          </div>
        </div>
        <div className="tf-checkout-wrap flex-lg-nowrap">
          <div className="page-checkout">
            <div className="wrap">
              <h5 className="title has-account">
                <span className="fw-semibold">Contact</span>
              </h5>
              <form className="form-checkout-contact">
                <label className="body-md-2 fw-semibold">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  className="def"
                  type="email"
                  placeholder="Your valid email"
                  ref={emailRef}
                  required
                  onChange={(e) => validateField("email", e.target.value)}
                />
                {errors.email && (
                  <p className="caption text-danger">{errors.email}</p>
                )}
                <p className="caption text-main-2 font-2">
                  Order information will be sent to your email
                </p>
              </form>
              <form className="form-checkout-contact mt-3">
                <label className="body-md-2 fw-semibold">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <input
                  className="def"
                  type="number"
                  placeholder="Your valid contact"
                  ref={phoneRef}
                  required
                  onChange={(e) => validateField("phone", e.target.value)}
                />
                {errors.phone && (
                  <p className="caption text-danger">{errors.phone}</p>
                )}
              </form>
            </div>
            <div className="wrap">
              <h5 className="title fw-semibold">Delivery</h5>
              <form action="#" className="def">
                <div className="cols">
                  <fieldset>
                    <label>
                      First Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      ref={firstNameRef}
                      required
                      onChange={(e) => validateField("firstName", e.target.value)}
                    />
                    {errors.firstName && (
                      <p className="caption text-danger">{errors.firstName}</p>
                    )}
                  </fieldset>
                  <fieldset>
                    <label>
                      Last Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      ref={lastNameRef}
                      required
                      onChange={(e) => validateField("lastName", e.target.value)}
                    />
                    {errors.lastName && (
                      <p className="caption text-danger">{errors.lastName}</p>
                    )}
                  </fieldset>
                </div>
                <fieldset>
                  <label>
                    CNIC Number <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="42xxxxxxxxxxx"
                    ref={cnicRef}
                    required
                    onChange={(e) => validateField("cnic", e.target.value)}
                  />
                  {errors.cnic && (
                    <p className="caption text-danger">{errors.cnic}</p>
                  )}
                </fieldset>
                <div className="cols">
                  <fieldset>
                    <label>
                      City <span className="text-primary">*</span>
                    </label>
                    <div className="tf-select">
                      <select ref={cityRef} onChange={handleCityChange}>
                        <option>Select</option>
                        <option>Alabam</option>
                        <option>Alaska</option>
                        <option>California</option>
                        <option>Georgia</option>
                        <option>Washington</option>
                      </select>
                      {errors.city && (
                        <p className="caption text-danger">{errors.city}</p>
                      )}
                    </div>
                  </fieldset>
                  <fieldset>
                    <label>
                      Area <span className="text-primary">*</span>
                    </label>
                    <div className="tf-select">
                      <select
                        ref={areaRef}
                        disabled={selectedCity === "Select" || !areas.length}
                        onChange={(e) => validateField("area", e.target.value)}
                      >
                        <option>Select</option>
                        {areas.map((area, index) => (
                          <option key={index}>{area}</option>
                        ))}
                      </select>
                      {errors.area && (
                        <p className="caption text-danger">{errors.area}</p>
                      )}
                    </div>
                  </fieldset>
                </div>
                <fieldset>
                  <label>
                    Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your detailed address"
                    ref={addressRef}
                    required
                    onChange={(e) => validateField("address", e.target.value)}
                  />
                  {errors.address && (
                    <p className="caption text-danger">{errors.address}</p>
                  )}
                </fieldset>
                <fieldset>
                  <label>Order Notes (optional)</label>
                  <textarea placeholder="Note on your order" defaultValue={""} />
                </fieldset>
              </form>
            </div>
            <div className="wrap">
              <h5 className="title fw-semibold">Payment</h5>
              <div className="form-payment">
                <div className="payment-box">
                  <p className="body-md-2 fw-semibold">Advance cash on delivery</p>
                </div>
                <div className="box-btn">
                  <button
                    onClick={handlePlaceOrder}
                    className="tf-btn w-100"
                    type="button"
                  >
                    <span className="text-white">Place order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flat-sidebar-checkout">
            <div className="sidebar-checkout-content">
              <h5 className="fw-semibold">Order Summary</h5>
              {cartData ? (
                <ul className="list-product">
                  <li className="item-product">
                    <a href="#" className="img-product">
                      <Image
                        alt=""
                        src={cartData.imageUrl}
                        width={500}
                        height={500}
                      />
                    </a>
                    <div className="content-box">
                      <a
                        href={`/product-details/${cartData.productSlug}`}
                        className="link-secondary body-md-2 fw-semibold"
                      >
                        {cartData.productName}
                      </a>
                      <p className="body-md-2 text-main-2 fw-semibold">
                        Total Deal Value Rs. {cartData.selectedPlan.totalPrice}
                      </p>
                      <p className="body-md-2 text-main-2">
                        Plan: Rs {cartData.selectedPlan.monthlyAmount} x{" "}
                        {cartData.selectedPlan.months} months
                      </p>
                      <div className="body-md-2 text-main-2">
                        <button
                          className="text-primary link check-btn"
                          onClick={removeItem}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              ) : (
                <div className="w-100 d-flex justify-content-center align-items-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <div className="">
                <p className="body-md-2 fw-semibold sub-type">Discount code</p>
                <form action="#" className="ip-discount-code style-2">
                  <input
                    type="text"
                    className="def"
                    placeholder="Your code"
                    required
                  />
                  <button type="submit" className="tf-btn btn-gray-2">
                    <span>Apply</span>
                  </button>
                </form>
              </div>
              <ul className="sec-total-price">
                <li>
                  <span className="body-text-3">Advance Amount</span>
                  <span className="body-text-3">
                    Rs. {cartData?.selectedPlan?.advance || "0"}
                  </span>
                </li>
                <li>
                  <span className="body-text-3">Monthly Amount</span>
                  <span className="body-text-3">
                    Rs. {cartData?.selectedPlan?.monthlyAmount || "0"} / for{" "}
                    {cartData?.selectedPlan?.months} Months
                  </span>
                </li>
                <li>
                  <span className="body-md-2 fw-semibold">Total</span>
                  <span className="body-md-2 fw-semibold text-primary">
                    Rs. {cartData?.selectedPlan?.advance || "0"}
                  </span>
                </li>
                <li>
                  <span className="body-text-3">Shipping</span>
                  <span className="body-text-3">Free shipping</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}