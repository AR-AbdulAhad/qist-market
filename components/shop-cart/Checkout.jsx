"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Area from "@/components/common/Area";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Checkout() {
  const { user, token } = useContext(AuthContext);
  const [cartData, setCartData] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const router = useRouter();
  const otpInputRefs = useRef([]);

  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const alternativePhoneRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const cnicRef = useRef(null);
  const cityRef = useRef(null);
  const addressRef = useRef(null);

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
    if (user && token) {
      emailRef.current.value = user.email || "";
      phoneRef.current.value = user.phone || "";
      alternativePhoneRef.current.value = user.alternativePhone || "";
      firstNameRef.current.value = user.firstName || "";
      lastNameRef.current.value = user.lastName || "";
      cnicRef.current.value = user.cnic || "";

      const fetchDefaultAddress = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/customer/addresses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const addresses = await res.json();
            const defaultAddr = addresses.find((addr) => addr.isDefault);
            if (defaultAddr) {
              setDefaultAddress(defaultAddr);
              setUseDefaultAddress(true);
              addressRef.current.value = defaultAddr.address1;
              setSelectedArea(defaultAddr.area || "");
              const city = defaultAddr.city;
              setSelectedCity(city);
              cityRef.current.value = city;
            }
          }
        } catch (error) {
          console.error("Error fetching default address:", error);
        }
      };
      fetchDefaultAddress();
    }
  }, [user, token]);

  useEffect(() => {
    const data = Cookies.get("cartData");
    if (!data) {
      router.push("/shop-cart");
    }
  }, [router]);

  const removeItem = () => {
    Cookies.remove("cartData", { path: "/" });
    setCartData(null);
    router.push("/shop-cart");
  };

  const handleCityChange = (e) => {
    if (!useDefaultAddress) {
      const city = e.target.value;
      setSelectedCity(city);
      setSelectedArea("");
      validateField("city", city);
    }
  };

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);
    validateField("area", area);
  };

  const handleDefaultAddressChange = (e) => {
    const isChecked = e.target.checked;
    setUseDefaultAddress(isChecked);
    if (isChecked && defaultAddress) {
      addressRef.current.value = defaultAddress.address1;
      setSelectedArea(defaultAddress.area || "");
      cityRef.current.value = defaultAddress.city;
      setSelectedCity(defaultAddress.city);
    } else {
      addressRef.current.value = "";
      setSelectedArea("");
      cityRef.current.value = "";
      setSelectedCity("");
    }
  };

  const validateField = (fieldName, value) => {
    let error = null;
    switch (fieldName) {
      case "email":
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "phone":
        if (!value || !/^\d{11,}$/.test(value)) {
          error = "A valid WhatsApp number (minimum 11 digits) is required";
        }
        break;
      case "alternativePhone":
        if (value && !/^\d{11,}$/.test(value)) {
          error = "Alternative phone number must be at least 11 digits if provided";
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
        if (!value) {
          error = "City selection is required";
        }
        break;
      case "area":
        if (!value) {
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
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone || !/^\d{11,}$/.test(formData.phone)) {
      newErrors.phone = "A valid WhatsApp number (minimum 11 digits) is required";
    }
    if (formData.alternativePhone && !/^\d{11,}$/.test(formData.alternativePhone)) {
      newErrors.alternativePhone = "Alternative phone number must be at least 11 digits if provided";
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
    if (!formData.city) {
      newErrors.city = "City selection is required";
    }
    if (!formData.area) {
      newErrors.area = "Area selection is required";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!formData.productName) {
      newErrors.productName = "Product name is required";
    }
    if (isNaN(formData.totalDealValue) || formData.totalDealValue < 0) {
      newErrors.totalDealValue = "Total deal value must be a non-negative number";
    }
    if (isNaN(formData.advanceAmount) || formData.advanceAmount < 0) {
      newErrors.advanceAmount = "Advance amount must be a non-negative number";
    }
    if (isNaN(formData.monthlyAmount) || formData.monthlyAmount < 0) {
      newErrors.monthlyAmount = "Monthly amount must be a non-negative number";
    }
    if (!Number.isInteger(formData.months) || formData.months < 0) {
      newErrors.months = "Months must be a non-negative integer";
    }
    return newErrors;
  };

  // OTP handlers
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...otpCode];
      newCode[index] = value;
      setOtpCode(newCode);
      setOtpError("");
      if (value && index < 5) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtpCode(pasted.split(""));
      setOtpError("");
      otpInputRefs.current[5].focus();
    }
  };

  const handleSendOtp = async (phone) => {
    if (!phone || !/^\d{11,}$/.test(phone)) {
      toast.error("Valid WhatsApp number required to send OTP");
      return false;
    }
    setOtpLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/customer/resend`, {
        identifier: phone,
        isForReset: false,
      });
      toast.success("OTP sent to your WhatsApp number");
      setShowOtpInput(true);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send OTP");
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async (phone) => {
    setOtpLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/customer/resend`, {
        identifier: phone,
        isForReset: false,
      });
      toast.success("OTP resent to your WhatsApp number");
      setOtpCode(["", "", "", "", "", ""]);
      setOtpError("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (phone, verificationCode) => {
    try {
      await axios.post(`${BACKEND_URL}/api/customer/verify`, {
        identifier: phone,
        code: verificationCode,
        isForReset: false,
      });
      return true;
    } catch (err) {
      setOtpError(err.response?.data?.error || "Failed to verify OTP");
      return false;
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!cartData || !cartData.productName || !cartData.selectedPlan) {
      setErrors({ api: "Cart data is incomplete or missing" });
      setIsLoading(false);
      return;
    }
    const { productName, selectedPlan } = cartData;
    const requiredPlanFields = ["totalPrice", "advance", "monthlyAmount", "months"];
    for (const field of requiredPlanFields) {
      if (
        selectedPlan[field] === undefined ||
        selectedPlan[field] === null ||
        isNaN(selectedPlan[field]) ||
        selectedPlan[field] < 0
      ) {
        setErrors({ api: `Invalid plan data: ${field} is missing or invalid` });
        setIsLoading(false);
        return;
      }
    }

    const formData = {
      email: emailRef.current.value || null,
      phone: phoneRef.current.value,
      alternativePhone: alternativePhoneRef.current.value || null,
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      cnic: cnicRef.current.value,
      city: cityRef.current.value,
      area: selectedArea,
      address: addressRef.current.value,
      orderNotes: document.querySelector("textarea").value,
      paymentMethod: "Advance cash on delivery",
      productName: productName,
      totalDealValue: selectedPlan.totalPrice,
      advanceAmount: selectedPlan.advance,
      monthlyAmount: selectedPlan.monthlyAmount,
      months: selectedPlan.months,
      customerID: user ? user.customerId : null,
    };

    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const fieldRefs = {
        email: emailRef,
        phone: phoneRef,
        alternativePhone: alternativePhoneRef,
        firstName: firstNameRef,
        lastName: lastNameRef,
        cnic: cnicRef,
        city: cityRef,
        address: addressRef,
      };
      fieldRefs[firstErrorField]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setIsLoading(false);
      return;
    }

    // If OTP input is not shown, send OTP and show input fields
    if (!showOtpInput) {
      const otpSent = await handleSendOtp(formData.phone);
      setIsLoading(false);
      if (!otpSent) {
        return;
      }
      return;
    }

    // Verify OTP
    const verificationCode = otpCode.join("");
    if (verificationCode.length !== 6) {
      setOtpError("Please enter a 6-digit OTP");
      setIsLoading(false);
      return;
    }

    const otpVerified = await handleVerifyOtp(formData.phone, verificationCode);
    if (!otpVerified) {
      setIsLoading(false);
      return;
    }

    // Proceed with order placement
    try {
      const response = await fetch(`${BACKEND_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const orderData = await response.json();
        sessionStorage.setItem("orderData", JSON.stringify(orderData));
        Cookies.remove("cartData", { path: "/" });
        setShowOtpInput(false);
        setOtpCode(["", "", "", "", "", ""]);
        setOtpError("");
        router.push("/order-details");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to create order");
        setErrors({
          api: errorData.error || "Failed to create order",
          details: errorData.details,
        });
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
      setErrors({
        api: "Failed to connect to the server",
        details: error.message,
      });
    } finally {
      setIsLoading(false);
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
                <div className="field-flex">
                  <label className="body-md-2 fw-semibold">
                    Email Address (optional)
                  </label>
                  <label className="body-md-2 fw-semibold">ای میل ایڈریس (اختیاری)</label>
                </div>
                <input
                  className="def"
                  type="email"
                  placeholder="Email (e.g., ahad@example.com)"
                  ref={emailRef}
                  onChange={(e) => validateField("email", e.target.value)}
                />
                {errors.email && (
                  <p className="caption text-danger">{errors.email}</p>
                )}
                <p className="caption text-main-2 font-2">
                  Order information will be sent to your email if provided
                </p>
              </form>
              <form className="form-checkout-contact mt-3">
                <div className="field-flex">
                  <label className="body-md-2 fw-semibold">
                    WhatsApp Number <span className="text-primary">*</span>
                  </label>
                  <label className="body-md-2 fw-semibold">واٹس ایپ نمبر</label>
                </div>
                <input
                  className="def"
                  type="number"
                  placeholder="WhatsApp Number (e.g., 03001234567)"
                  ref={phoneRef}
                  required
                  onChange={(e) => validateField("phone", e.target.value)}
                />
                {errors.phone && (
                  <p className="caption text-danger">{errors.phone}</p>
                )}
              </form>
              <form className="form-checkout-contact mt-3">
                <div className="field-flex">
                  <label className="body-md-2 fw-semibold">
                    Alternative Number (optional)
                  </label>
                  <label className="body-md-2 fw-semibold">متبادل فون نمبر (اختیاری)</label>
                </div>
                <input
                  className="def"
                  type="number"
                  placeholder="Alternative Number (e.g., 03009876543)"
                  ref={alternativePhoneRef}
                  onChange={(e) => validateField("alternativePhone", e.target.value)}
                />
                {errors.alternativePhone && (
                  <p className="caption text-danger">{errors.alternativePhone}</p>
                )}
              </form>
            </div>
            <div className="wrap">
              <h5 className="title fw-semibold">Order Details</h5>
              <form action="#" className="def">
                <div className="cols">
                  <fieldset>
                    <div className="field-flex">
                      <label>
                        First Name <span className="text-primary">*</span>
                      </label>
                      <label className="body-md-2 fw-semibold">پہلا نام</label>
                    </div>
                    <input
                      type="text"
                      placeholder="First Name (e.g., Abdul)"
                      ref={firstNameRef}
                      required
                      onChange={(e) => validateField("firstName", e.target.value)}
                    />
                    {errors.firstName && (
                      <p className="caption text-danger">{errors.firstName}</p>
                    )}
                  </fieldset>
                  <fieldset>
                    <div className="field-flex">
                      <label>
                        Last Name <span className="text-primary">*</span>
                      </label>
                      <label className="body-md-2 fw-semibold">آخری نام</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Last Name (e.g., Ahad)"
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
                  <div className="field-flex">
                    <label>
                      CNIC Number <span className="text-primary">*</span>
                    </label>
                    <label className="body-md-2 fw-semibold">شناختی کارڈ نمبر</label>
                  </div>
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
                {defaultAddress && (
                  <div className="tf-cart-checkbox mb-3">
                    <input
                      type="checkbox"
                      name="use_default_address"
                      className="tf-check"
                      id="useDefaultAddress"
                      checked={useDefaultAddress}
                      onChange={handleDefaultAddressChange}
                    />
                    <label htmlFor="useDefaultAddress">Use default address</label>
                  </div>
                )}
                <div className="cols">
                  <fieldset>
                    <div className="field-flex">
                      <label>
                        Select City <span className="text-primary">*</span>
                      </label>
                      <label className="body-md-2 fw-semibold">شہر منتخب کریں</label>
                    </div>
                    {useDefaultAddress && defaultAddress ? (
                      <input
                        type="text"
                        ref={cityRef}
                        value={defaultAddress.city}
                        readOnly
                        disabled
                        className="def"
                        onChange={(e) => validateField("city", e.target.value)}
                      />
                    ) : (
                      <div className="tf-select">
                        <select
                          name="Location"
                          id="Location"
                          ref={cityRef}
                          value={selectedCity}
                          onChange={handleCityChange}
                          required
                        >
                          <option value="" disabled>
                            Select The City
                          </option>
                          <option value="Karachi">Karachi</option>
                        </select>
                        {errors.city && (
                          <p className="caption text-danger">{errors.city}</p>
                        )}
                      </div>
                    )}
                  </fieldset>
                  <fieldset>
                    <div className="field-flex">
                      <label>
                        Select Area <span className="text-primary">*</span>
                      </label>
                      <label className="body-md-2 fw-semibold">علاقہ منتخب کریں</label>
                    </div>
                    <Area
                      cityName={selectedCity}
                      value={selectedArea}
                      onChange={handleAreaChange}
                      disabled={useDefaultAddress && defaultAddress}
                    />
                    {errors.area && (
                      <p className="caption text-danger">{errors.area}</p>
                    )}
                  </fieldset>
                </div>
                <fieldset>
                  <div className="field-flex">
                    <label>
                      Address <span className="text-primary">*</span>
                    </label>
                    <label className="body-md-2 fw-semibold">پتہ</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Address"
                    ref={addressRef}
                    required
                    readOnly={useDefaultAddress && defaultAddress}
                    onChange={(e) => validateField("address", e.target.value)}
                  />
                  {errors.address && (
                    <p className="caption text-danger">{errors.address}</p>
                  )}
                </fieldset>
                <fieldset>
                  <div className="field-flex">
                    <label>Order Notes (optional)</label>
                    <label className="body-md-2 fw-semibold">آرڈر کے مطلق خاص ہدایات (انتخابی)</label>
                  </div>
                  <textarea placeholder="Order Notes" defaultValue={""} />
                </fieldset>
              </form>
            </div>
          </div>
          <div className="d-flex flex-column sidebar-checkout-custom">
            <h5 className="title has-account">
              <span className="fw-semibold">Your Order</span>
              <span className="fw-semibold">آپ کا آرڈر</span>
            </h5>
            <div className="flat-sidebar-checkout position-relative top-0 w-100">
              <div className="sidebar-checkout-content">
                <div className="has-account field-flex">
                  <span className="fw-semibold">Order Details</span>
                  <span className="fw-semibold">آرڈر کی تفصیلات</span>
                </div>
                {cartData ? (
                  <ul className="list-product">
                    <li className="item-product d-flex align-items-center">
                      <a href="#" className="img-product">
                        <Image
                          alt=""
                          src={cartData.imageUrl || "/images/product-placeholder/product-placeholder-image.png"}
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
                <ul className="sec-total-price">
                  <li>
                    <span className="body-text-3">
                      Advance Amount:{" "}
                      <span className="body-text-3 text-primary">
                        Rs. {cartData?.selectedPlan?.advance.toLocaleString() || "0"}
                      </span>
                    </span>
                    <span className="body-text-3">ایڈوانس رقم</span>
                  </li>
                  <li>
                    <span className="body-text-3">
                      Monthly Amount:{" "}
                      <span className="body-text-3">
                        <span className="text-primary">
                          Rs. {cartData?.selectedPlan?.monthlyAmount.toLocaleString() || "0"}
                        </span>{" "}
                        / for {cartData?.selectedPlan?.months} Months
                      </span>
                    </span>
                    <span className="body-text-3">ماہانہ رقم</span>
                  </li>
                  <li>
                    <span className="body-text-3">
                      Total Deal Value:{" "}
                      <span className="body-text-3 text-primary">
                        Rs. {cartData?.selectedPlan?.totalPrice.toLocaleString() || "0"}
                      </span>
                    </span>
                    <span className="body-text-3">کل مالیاتی قیمت</span>
                  </li>
                  <li>
                    <span className="body-md-2 fw-semibold text-uppercase d-flex flex-column gap-1">
                      <span>Total Advance</span>
                      <span>کل ایڈوانس</span>
                    </span>
                    <span className="body-md-2 fw-semibold text-primary">
                      Rs. {cartData?.selectedPlan?.advance.toLocaleString() || "0"}
                    </span>
                  </li>
                  <li></li>
                  <div className="body-md-2 fw-semibold mb-2">
                    <p>
                      <span className="text-success">✓</span> Free Delivery / مفت ڈیلیوری
                    </p>
                    <p>
                      <span className="text-success">✓</span> Advance Cash on Delivery / آدائیگی آئٹم سپردگی کے وقت
                    </p>
                  </div>
                  <div className="body-md-2 fw-semibold">
                    <p className="mb-1">
                      Free delivery on all orders / No verification charges / Shop without bank
                      account/card / No charges for documentation
                    </p>
                    <p>
                      تمام آرڈرز پر مفت ڈیلیوری / کوئی تصدیق کے چارجز نہیں / بینک اکاؤنٹ/کارڈ کے بغیر شاپنگ /
                      دستاویزات کے لیے کوئی چارجز نہیں
                    </p>
                  </div>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <p>
                By clicking on Place Order, I have read and accepted the{" "}
                <a href="/terms-conditions" className="text-primary">
                  terms and conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary">
                  privacy policy
                </a>{" "}
                of Qist Market.<span className="text-primary">*</span>
              </p>
              <p className="text-end">میں شرائط و ضوابط سے اتفاق کرتا ہوں</p>
            </div>
            {showOtpInput && (
              <div className="wrap mt-4">
                <h5 className="title fw-semibold">Verify WhatsApp Number</h5>
                <p className="body-text-3 mb-2">
                  A 6-digit OTP has been sent to your WhatsApp number. Enter it to proceed.
                </p>
                <div className="d-flex justify-content-center gap-2">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      className={`form-control text-center ${otpError ? "is-invalid" : ""}`}
                      style={{ width: "40px" }}
                    />
                  ))}
                </div>
                {otpError && <p className="caption text-danger text-center">{otpError}</p>}
                <p className="body-text-3 text-center mt-3">
                  Didn't receive the code?{" "}
                  <a
                    href="#"
                    className="text-primary"
                    onClick={() => handleResendOtp(phoneRef.current.value)}
                  >
                    Resend OTP
                  </a>
                </p>
              </div>
            )}
            <div className="wrap mt-4">
              <div className="box-btn">
                <button
                  onClick={handlePlaceOrder}
                  className="tf-btn w-100 justify-content-start"
                  type="button"
                  disabled={isLoading || otpLoading}
                >
                  {isLoading || otpLoading ? (
                    <div className="w-100 text-white">Processing...</div>
                  ) : (
                    <div className="w-100 d-flex justify-content-between text-white">
                      <p>Place order</p>
                      <p>آرڈر کریں</p>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}