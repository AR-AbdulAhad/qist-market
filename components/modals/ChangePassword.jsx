"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContextElement } from "@/context/Context";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ChangePassword() {
  const { modalProps, openModal } = useContextElement();
  const { identifier, code } = modalProps;
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters long";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const resetForm = () => {
    setFormData({ newPassword: "", confirmNewPassword: "" });
    setErrors({});
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !code) {
      toast.error("Required information is missing. Please try again from the forgot password step.");
      return;
    }
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/customer/reset`, {
        identifier,
        code,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      });
      toast.success("Password reset successful");
      openModal("log");
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById("changePassword");
    const handleHidden = () => {
      resetForm();
    };
    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  return (
    <div className="modal modalCentered fade modal-log" id="changePassword">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon icon-close btn-hide-popup" data-bs-dismiss="modal" />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Reset Password</h5>
            <form onSubmit={handleSubmit} className="form-log">
              <div className="form-content">
                <fieldset className="position-relative">
                  <label className="fw-semibold body-md-2">
                    New Password <span className="text-primary">*</span>
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter your new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={errors.newPassword ? "is-invalid" : ""}
                  />
                  <span
                    className="position-absolute end-0 icon-eye-top translate-middle-y pe-3"
                    onClick={toggleNewPasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#6c757d"/>
                    </svg>
                  </span>
                  {errors.newPassword && (
                    <div className="invalid-feedback">{errors.newPassword}</div>
                  )}
                </fieldset>
                <fieldset className="position-relative">
                  <label className="fw-semibold body-md-2">
                    Confirm New Password <span className="text-primary">*</span>
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    placeholder="Confirm your new password"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    className={errors.confirmNewPassword ? "is-invalid" : ""}
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
                  {errors.confirmNewPassword && (
                    <div className="invalid-feedback">{errors.confirmNewPassword}</div>
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
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}