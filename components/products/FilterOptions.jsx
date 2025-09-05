import React, { useState, useEffect } from "react";
import ShowAllCategories from "./ShowAllCategories";

export default function FilterOptions({ allProps }) {
  const [priceRange, setPriceRange] = useState([null, null]);
  const [subcategories, setSubcategories] = useState([]);
  const [visibleSubcategories, setVisibleSubcategories] = useState(5);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch("https://qistbackend-1.onrender.com/api/subcategories/active", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch subcategories");
        const data = await response.json();
        setSubcategories(data);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };
    fetchSubcategories();
  }, []);

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
      <div className="widget-facet facet-fieldset has-loadmore">
        <p className="facet-title title-sidebar fw-semibold">Brands</p>
        <div className="box-fieldset-item">
          {subcategories.slice(0, visibleSubcategories).map((subcategory) => (
            <fieldset
              key={subcategory.id}
              onClick={() => allProps.setSubcategories(subcategory.id)}
              className="fieldset-item"
            >
              <input
                type="checkbox"
                className="tf-check"
                readOnly
                checked={allProps.subcategories.includes(subcategory.id)}
              />
              <label>{subcategory.name}</label>
            </fieldset>
          ))}
        </div>
        {subcategories.length > visibleSubcategories && (
          <div
            className="btn-loadmore"
            onClick={() => setVisibleSubcategories(subcategories.length)}
          >
            See more <i className="icon-arrow-down" />
          </div>
        )}
      </div>
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