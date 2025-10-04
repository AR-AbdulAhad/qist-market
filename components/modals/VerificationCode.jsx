"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useContextElement } from "@/context/Context";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VerificationCode() {
  const { modalProps, openModal } = useContextElement();
  const { identifier, isForReset = false } = modalProps;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError("");
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setCode(pasted.split(""));
      setError("");
      inputRefs.current[5].focus();
    }
  };

  const resetForm = () => {
    setCode(["", "", "", "", "", ""]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (!identifier) {
      toast.error("Identifier is missing. Please try again from the previous step.");
      return;
    }
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/customer/verify`, {
        identifier,
        code: verificationCode,
        isForReset,
      });
      toast.success("Code verified successfully");
      openModal(isForReset ? "changePassword" : "log", { identifier, code: verificationCode });
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!identifier) {
      toast.error("Identifier is missing. Please try again from the previous step.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/customer/resend`, { identifier, isForReset });
      toast.success("Verification code resent successfully to WhatsApp");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const modalElement = document.getElementById("verificationCode");
    const handleHidden = () => {
      resetForm();
    };
    modalElement.addEventListener("hidden.bs.modal", handleHidden);
    return () => {
      modalElement.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  return (
    <div className="modal modalCentered fade modal-log" id="verificationCode">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span className="icon icon-close btn-hide-popup" data-bs-dismiss="modal" />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Enter Verification Code</h5>
            <p className="body-text-3 text-center">
              A 6-digit code has been sent to your WhatsApp number.
            </p>
            <form onSubmit={handleSubmit} className="form-log">
              <div className="form-content">
                <div className="d-flex justify-content-center gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className={`form-control text-center ${error ? "is-invalid" : ""}`}
                      style={{ width: "40px" }}
                    />
                  ))}
                </div>
                {error && <div className="invalid-feedback d-block text-center">{error}</div>}
                <p className="body-text-3 text-center mt-3">
                  Didn't receive the code?{" "}
                  <a href="#" className="text-primary" onClick={handleResend}>
                    Resend
                  </a>
                </p>
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
                  "Verify"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}