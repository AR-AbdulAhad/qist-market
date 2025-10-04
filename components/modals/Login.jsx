"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContextElement } from "@/context/Context";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Login() {
  const { openModal, closeModal } = useContextElement();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier) {
      newErrors.identifier = "Email or whatsapp number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const resetForm = () => {
    setFormData({ identifier: "", password: "", rememberMe: false });
    setErrors({});
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/customer/login`, formData);
      const { token } = response.data;
      Cookies.set("token", token, {
        expires: formData.rememberMe ? 30 : 7,
        path: "/",
      });
      toast.success("Login successful!");
      closeModal();
      resetForm();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        openModal("verificationCode", { identifier: formData.identifier });
      } else {
        toast.error(err.response?.data?.error || "Failed to log in");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById("log");
    const handleHidden = () => {
      resetForm();
    };
    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  return (
    <div className="modal modalCentered fade modal-log" id="log">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon icon-close btn-hide-popup" data-bs-dismiss="modal" />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Log In</h5>
            <form onSubmit={handleSubmit} className="form-log">
              <div className="form-content">
                <p className="body-text-3">Use the same whatsapp number you used to place the order</p>
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    Email or WhatsApp Number <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Enter your email or whatsapp number"
                    value={formData.identifier}
                    onChange={handleChange}
                    className={errors.identifier ? "is-invalid" : ""}
                  />
                  {errors.identifier && (
                    <div className="invalid-feedback">{errors.identifier}</div>
                  )}
                </fieldset>
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
                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="rememberMe"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#forgotPassword"
                    data-bs-toggle="modal"
                    className="link text-end body-text-3"
                    onClick={() => openModal("forgotPassword")}
                  >
                    Forgot password?
                  </a>
                </div>
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
                  "Login"
                )}
              </button>
              <p className="body-text-3 text-center">
                Don't have an account?
                <a
                  href="#register"
                  data-bs-toggle="modal"
                  className="text-primary"
                  onClick={() => openModal("register")}
                >
                  Register
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}