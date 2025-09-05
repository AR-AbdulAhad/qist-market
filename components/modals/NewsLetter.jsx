"use client";

import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
export default function NewsLetter() {
  const modalElement = useRef();
  useEffect(() => {
    const showModal = async () => {
      const bootstrap = await import("bootstrap"); // dynamically import bootstrap
      const myModal = new bootstrap.Modal(
        document.getElementById("newsletterPopup"),
        {
          keyboard: false,
        }
      );

      // Show the modal after a delay using a promise
      await new Promise((resolve) => setTimeout(resolve, 2000));
      myModal.show();

      modalElement.current.addEventListener("hidden.bs.modal", () => {
        myModal.hide();
      });
    };

    showModal();
  }, []);
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };
  const sendEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const email = e.target.email.value;

    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        {
          email,
        }
      );

      if ([200, 201].includes(response.status)) {
        e.target.reset(); // Reset the form
        setSuccess(true); // Set success state
        handleShowMessage();
      } else {
        setSuccess(false); // Handle unexpected responses
        handleShowMessage();
      }
    } catch (error) {
      console.error("Error:", error.response?.data || "An error occurred");
      setSuccess(false); // Set error state
      handleShowMessage();
      e.target.reset(); // Reset the form
    }
  };
  return (
    <div
      ref={modalElement}
      id="newsletterPopup"
      className="modal modalCentered fade auto-popup modal-def modal-newleter"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center">
          <span
            className="icon icon-close icon-close-popup link"
            data-bs-dismiss="modal"
          />
          <div className="heading">
            <h5 className="fw-semibold">Join our newsletter for $10 offs</h5>
            <p className="body-md-2">
              Register now to get latest updates on promotions &amp; coupons.{" "}
              <br />
              Don’t worry, we not spam!
            </p>
          </div>
          <div
            className={`tfSubscribeMsg  footer-sub-element ${
              showMessage ? "active" : ""
            }`}
          >
            {success ? (
              <p style={{ color: "rgb(52, 168, 83)" }}>
                You have successfully subscribed.
              </p>
            ) : (
              <p style={{ color: "red" }}>Something went wrong</p>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendEmail(e);
            }}
            className="form-sub"
          >
            <div className="form-content">
              <fieldset>
                <input
                  type="email"
                  id="mail"
                  name="email"
                  placeholder="Enter Your Email Address"
                  aria-required="true"
                  required=""
                />
              </fieldset>
            </div>
            <div className="box-btn">
              <button type="submit" className="tf-btn w-100">
                <span className="text-white">Subcribe</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
