import React from "react";

export default function Login() {
  return (
    <div className="modal modalCentered fade modal-log" id="log">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <span
            className="icon icon-close btn-hide-popup"
            data-bs-dismiss="modal"
          />
          <div className="modal-log-wrap list-file-delete">
            <h5 className="title fw-semibold">Log In</h5>
            <form action="#" className="form-log">
              <div className="form-content">
                <fieldset>
                  <label className="fw-semibold body-md-2">
                    {" "}
                    Phone number *{" "}
                  </label>
                  <input type="text" placeholder="Your email" />
                </fieldset>
                <fieldset>
                  <label className="fw-semibold body-md-2"> Password * </label>
                  <input type="password" placeholder="Enter your password" />
                </fieldset>
                <a href="#" className="link text-end body-text-3">
                  Forgot password ?
                </a>
              </div>
              <button type="submit" className="tf-btn w-100 text-white">
                Login
              </button>
              <p className="body-text-3 text-center">
                Don't you have an account?
                <a
                  href="#register"
                  data-bs-toggle="modal"
                  className="text-primary"
                >
                  Register
                </a>
              </p>
            </form>
            <div className="orther-log text-center">
              <span className="br-line bg-gray-5" />
              <p className="caption text-main-2">Or login with</p>
            </div>
            <ul className="list-log">
              <li>
                <a href="#" className="tf-btn btn-line w-100">
                  <i className="icon icon-facebook-2" />
                  <span className="body-md-2 fw-semibold">Facebook</span>
                </a>
              </li>
              <li>
                <a href="#" className="tf-btn btn-line w-100">
                  <i className="icon icon-google" />
                  <span className="body-md-2 fw-semibold">Google</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
