"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContextElement } from "@/context/Context";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ForgotPassword() {
  const { openModal } = useContextElement();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!identifier) {
      setError("Email or whatsapp number is required");
      return false;
    }
    setError("");
    return true;
  };

  const resetForm = () => {
    setIdentifier("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/customer/forgot`, { identifier });
      toast.success("Reset code sent successfully to WhatsApp");
      openModal("verificationCode", { identifier, isForReset: true });
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById("forgotPassword");
    const handleHidden = () => {
      resetForm();
    };
    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  return (
    <div className="modal modalCentered fade modal-log" id="forgotPassword">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon icon-close btn-hide-popup" data-bs-dismiss="modal" />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Forgot Password</h5>
            <form onSubmit={handleSubmit} className="form-log">
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    Email or WhatsApp Number <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your email or whatsapp number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={error ? "is-invalid" : ""}
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </fieldset>
                <a
                  href="#log"
                  data-bs-toggle="modal"
                  className="link text-end body-text-3"
                  onClick={() => openModal("log")}
                >
                  Remembered your password?
                </a>
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
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}