"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useContextElement } from "@/context/Context";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VerificationCode() {
  const { modalProps, openModal } = useContextElement();
  const { email, isForReset = false } = modalProps;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleInputChange = (index, value) => {
    if (/^\d$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
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
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  };

  const resetForm = () => {
    setCode(["", "", "", "", "", ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (!email) {
      toast.error("Email is missing. Please try again from the previous step.");
      return;
    }
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/customer/verify`, {
        email,
        code: verificationCode,
        isForReset,
      });
      toast.success("Code verified successfully");
      openModal(isForReset ? "changePassword" : "log", { email, code: verificationCode });
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is missing. Please try again from the previous step.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/customer/resend`, { email, isForReset });
      toast.success("Verification code resent successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
            <form onSubmit={handleSubmit} className="form-log">
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    Verification Code <span className="text-primary">*</span>
                  </label>
                  <div className="d-flex justify-content-between gap-3">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="form-control text-center"
                        style={{
                          flex: "1",
                          height: "65px",
                          fontSize: "1.5rem",
                          borderRadius: "8px",
                        }}
                        placeholder="-"
                      />
                    ))}
                  </div>
                </fieldset>
                <a
                  href="#resend"
                  className="link text-end body-text-3"
                  onClick={handleResend}
                >
                  Resend Code?
                </a>
              </div>
              <button type="submit" className="tf-btn w-100 text-white" disabled={loading}>
                {loading ? (
                  <div >
                    Processing...{" "}
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