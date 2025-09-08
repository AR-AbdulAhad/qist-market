import React, { useState } from "react";
import ShowAllCategories from "./ShowAllCategories";

export default function FilterOptions2({ allProps }) {
  const [priceRange, setPriceRange] = useState([null, null]);

  const handleInputChange = (e, index) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    const newPriceRange = [...priceRange];
    newPriceRange[index] = value;
    setPriceRange(newPriceRange);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      priceRange[0] !== null &&
      priceRange[1] !== null &&
      priceRange[0] < priceRange[1]
    ) {
      allProps.setPrice(priceRange);
    }
  };

  return (
    <>
    <ShowAllCategories />
    <div className="widget-facet facet-price">
      <p className="facet-title title-sidebar fw-semibold">Price</p>
      <div className="box-price-product">
        <form onSubmit={handleSubmit} className="w-100 form-filter-price">
          <div className="cols w-100">
            <fieldset className="box-price-item">
              <input
                type="number"
                className="min-price price-input"
                value={priceRange[0] ?? ""}
                onChange={(e) => handleInputChange(e, 0)}
                min={0}
                placeholder="Rs. Min"
              />
            </fieldset>
            <span className="br-line" />
            <fieldset className="box-price-item">
              <input
                type="number"
                className="max-price price-input"
                value={priceRange[1] ?? ""}
                onChange={(e) => handleInputChange(e, 1)}
                placeholder="Rs. Max"
                min={0}
              />
            </fieldset>
          </div>
          <button type="submit" className="btn-filter-price cs-pointer link">
            <span className="title-sidebar fw-bold">Go</span>
          </button>
        </form>
      </div>
    </div>
    </>
  );
}