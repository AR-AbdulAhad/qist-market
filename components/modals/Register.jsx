"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContextElement } from "@/context/Context";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Register() {
  const { openModal } = useContextElement();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cnic: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.cnic) {
      newErrors.cnic = "CNIC is required";
    } else if (!/^\d{13}$/.test(formData.cnic)) {
      newErrors.cnic = "CNIC must be exactly 13 digits";
    }
    
    if (!formData.phone) {
      newErrors.phone = "whatsapp number is required";
    } else if (!/^0\d{10}$/.test(formData.phone)) {
      newErrors.phone = "WhatsApp number must start with 0 and be 11 digits";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      cnic: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/customer/signup`, formData);
      if (response.data.message === "Account updated successfully.") {
        toast.success("Sign up successful.");
        openModal("log");
      } else {
        toast.success("Sign up successful. Please verify your phone via WhatsApp.");
        openModal("verificationCode", { identifier: formData.phone, isForReset: false });
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById("register");
    const handleHidden = () => {
      resetForm();
    };
    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  return (
    <div className="modal modalCentered fade modal-log" id="register">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon icon-close btn-hide-popup" data-bs-dismiss="modal" />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Sign Up</h5>
            <form onSubmit={handleSubmit} className="form-log">
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name (e.g., Abdul Ahad)"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? "is-invalid" : ""}
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName}</div>
                  )}
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email (e.g., ahad@example.com)"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "is-invalid" : ""}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    CNIC Number <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    placeholder="Enter your 13-digit CNIC number"
                    value={formData.cnic}
                    onChange={handleChange}
                    className={errors.cnic ? "is-invalid" : ""}
                  />
                  {errors.cnic && (
                    <div className="invalid-feedback">{errors.cnic}</div>
                  )}
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    WhatsApp Number <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="WhatsApp Number (e.g., 03001234567)"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "is-invalid" : ""}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset className="position-relative">
                  <label className="fw-semibold body-md-2">
                    Password <span className="text-primary">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "is-invalid" : ""}
                  />
                  <span
                    className="position-absolute end-0 icon-eye-top translate-middle-y pe-3"
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#6c757d"/>
                    </svg>
                  </span>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset className="position-relative">
                  <label className="fw-semibold body-md-2">
                    Confirm Password <span className="text-primary">*</span>
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "is-invalid" : ""}
                  />
                  <span
                    className="position-absolute end-0 icon-eye-top translate-middle-y pe-3"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#6c757d"/>
                    </svg>
                  </span>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </fieldset>
              </div>
              <button type="submit" className="tf-btn w-100 text-white" disabled={loading}>
                {loading ? (
                  <div>
                    Processing...
                    <div className="spinner-border spinner-border-sm text-white" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
              <p className="body-text-3 text-center">
                Already have an account?
                <a
                  href="#log"
                  data-bs-toggle="modal"
                  className="text-primary"
                  onClick={() => openModal("log")}
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}