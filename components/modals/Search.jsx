"use client";
import React from "react";


export default function Search() {
  return (
    <div className="offcanvas offcanvas-top offcanvas-search" id="search">
      <div className="offcanvas-content">
        <div className="popup-header">
          <button
            className="icon-close icon-close-popup link"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="looking-for-wrap">
                <h3 className="heading fw-semibold text-center">
                  What are you looking for?
                </h3>
                <form action="#" className="form-search">
                  <fieldset>
                    <input
                      className=""
                      type="text"
                      placeholder="Search for anything"
                      name="text"
                      tabIndex={2}
                      defaultValue=""
                      aria-required="true"
                      required=""
                    />
                  </fieldset>
                  <button type="submit" className="button-submit">
                    <i className="icon-search" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
