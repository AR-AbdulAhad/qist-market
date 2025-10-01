"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSettings } from "@/context/SettingsContext";

export default function Contact() {
  const { settings, isLoading, error } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", subject: "", message: "" };

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }
    if (!formData.subject || formData.subject.length < 2) {
      newErrors.subject = "Subject must be at least 2 characters";
      isValid = false;
    }
    if (!formData.message || formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }
      toast.success("Message sent successfully");
      setFormData({ name: "", subject: "", message: "" });
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="wg-map">
          {isLoading ? (
            <span>Loading...</span>
          ) : error ? (
            <div className="text-center py-12">Error loading map</div>
          ) : settings && settings.map_iframe ? (
            <div
              style={{ borderRadius: 8, width: "100%" }}
              dangerouslySetInnerHTML={{ __html: settings.map_iframe }}
            />
          ) : (
            <div className="text-center py-12">No map available</div>
          )}
          <div className="bottom">
            <div className="contact-wrap">
              <div className="box-title">
                <h5 className="fw-semibold">Get A Quote</h5>
                <p className="body-text-3">
                  Fill up the form and our Team will get back to you within 24
                  hours.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="form-contact def">
                <fieldset>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </fieldset>
                <fieldset>
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                  )}
                </fieldset>
                <fieldset className="d-flex flex-column">
                  <label>Your message</label>
                  <textarea
                    name="message"
                    style={{ height: 170 }}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </fieldset>
                <div className="box-btn-submit">
                  <button
                    type="submit"
                    className="tf-btn text-white w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            </div>
            <div className="contact-info">
              <h5 className="fw-semibold">Contact Information</h5>
              {isLoading ? (
                  <span>Loading...</span>
              ) : error ? (
                <p className="body-text-3">Error loading contact information</p>
              ) : settings ? (
                <ul className="info-list">
                  {settings.address && (
                    <li>
                      <span className="icon">
                        <i className="icon-location" />
                      </span>
                      <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(
                          settings.address
                        )}`}
                        className="link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {settings.address}
                      </a>
                    </li>
                  )}
                  {settings.phone && (
                    <li>
                      <span className="icon">
                        <i className="icon-phone" />
                      </span>
                      <a
                        href={`tel:${settings.phone}`}
                        className="product-title fw-semibold link"
                      >
                        <span>{settings.phone}</span>
                      </a>
                    </li>
                  )}
                  {settings.email && (
                    <li>
                      <span className="icon">
                        <i className="icon-direction" />
                      </span>
                      <a href={`mailto:${settings.email}`} className="link">
                        <span>{settings.email}</span>
                      </a>
                    </li>
                  )}
                  {settings.socialLinks && settings.socialLinks.length > 0 && (
                    <li>
                      <span className="icon">
                        <i className="icon-social" />
                      </span>
                      <div className="social-links">
                        {settings.socialLinks.map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            dangerouslySetInnerHTML={{ __html: link.svg }}
                          />
                        ))}
                      </div>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="body-text-3">No contact information available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}