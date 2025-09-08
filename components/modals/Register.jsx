import React from "react";

export default function Register() {
  return (
    <div className="modal modalCentered fade modal-log" id="register">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span
            className="icon icon-close btn-hide-popup"
            data-bs-dismiss="modal"
          />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Sign Up</h5>
            <form action="#" className="form-log">
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    {" "}
                    First Name *{" "}
                  </label>
                  <input type="text" placeholder="First Name" />
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    {" "}
                    Last Name *{" "}
                  </label>
                  <input type="text" placeholder="Last Name" />
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    {" "}
                    Email *{" "}
                  </label>
                  <input type="email" placeholder="Your Email" />
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    {" "}
                    Phone number *{" "}
                  </label>
                  <input type="text" placeholder="Your email" />
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    {" "}
                    Password *{" "}
                  </label>
                  <input type="text" placeholder="Your email" />
                </fieldset>
              </div>
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    {" "}
                    Confirm Password *{" "}
                  </label>
                  <input type="text" placeholder="Your email" />
                </fieldset>
              </div>
              <button type="submit" className="tf-btn w-100 text-white">
                Sign Up
              </button>
              <p className="body-text-3 text-center">
                Already have an account?
                <a href="#log" data-bs-toggle="modal" className="text-primary">
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
