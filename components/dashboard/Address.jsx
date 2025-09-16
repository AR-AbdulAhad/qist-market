"use client";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Address() {
  const { token, user } = useContext(AuthContext);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addAddressLoading, setAddAddressLoading] = useState(false);
  const [updateAddressLoading, setUpdateAddressLoading] = useState(false);
  const [deleteAddressLoading, setDeleteAddressLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newAddressErrors, setNewAddressErrors] = useState({});
  const [editAddressErrors, setEditAddressErrors] = useState({});
  const [selectedCityNew, setSelectedCityNew] = useState("Select");
  const [areasNew, setAreasNew] = useState([]);
  const [selectedCityEdit, setSelectedCityEdit] = useState("Select");
  const [areasEdit, setAreasEdit] = useState([]);

  const cityAreaMap = {
    Alabam: ["Downtown Alabam", "Alabam Suburbs", "North Alabam"],
    Alaska: ["Anchorage", "Fairbanks", "Juneau"],
    California: ["Los Angeles", "San Francisco", "San Diego"],
    Georgia: ["Atlanta", "Savannah", "Augusta"],
    Washington: ["Seattle", "Spokane", "Tacoma"],
  };

  const [newAddress, setNewAddress] = useState({
    address1: "",
    city: "",
    area: "",
    isDefault: false,
  });

  const [editAddressData, setEditAddressData] = useState({
    address1: "",
    city: "",
    area: "",
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    } else {
      setLoading(false);
      setError("Please log in to view addresses");
    }
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      } else {
        setError("Failed to load addresses");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const validateAddress = (formData, formType = "new") => {
    const newErrors = {};

    // Address1 validation
    if (!formData.address1.trim()) {
      newErrors.address1 = "Address line 1 is required";
    } else if (formData.address1.length < 5) {
      newErrors.address1 = "Address line 1 must be at least 5 characters long";
    }

    // City validation
    if (!formData.city || formData.city === "Select") {
      newErrors.city = "Please select a city";
    }

    // Area validation
    if (!formData.area) {
      newErrors.area = "Please select an area";
    }

    if (formType === "new") {
      setNewAddressErrors(newErrors);
    } else {
      setEditAddressErrors(newErrors);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleShowAddAddressForm = () => {
    setShowAddAddressForm(true);
  };

  const handleHideAddAddressForm = () => {
    setShowAddAddressForm(false);
    setNewAddress({
      address1: "",
      city: "",
      area: "",
      isDefault: false,
    });
    setNewAddressErrors({});
    setSelectedCityNew("Select");
    setAreasNew([]);
  };

  const handleInputChange = (e, formType = "new") => {
    const { id, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (formType === "new") {
      setNewAddress((prev) => ({ ...prev, [id]: newValue }));
      setNewAddressErrors((prev) => ({ ...prev, [id]: "" }));
    } else {
      setEditAddressData((prev) => ({ ...prev, [id]: newValue }));
      setEditAddressErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleCityChangeNew = (e) => {
    const city = e.target.value;
    setSelectedCityNew(city);
    setAreasNew(cityAreaMap[city] || []);
    setNewAddress((prev) => ({ ...prev, city, area: "" }));
    setNewAddressErrors((prev) => ({ ...prev, city: "", area: "" }));
  };

  const handleCityChangeEdit = (e) => {
    const city = e.target.value;
    setSelectedCityEdit(city);
    setAreasEdit(cityAreaMap[city] || []);
    setEditAddressData((prev) => ({ ...prev, city, area: "" }));
    setEditAddressErrors((prev) => ({ ...prev, city: "", area: "" }));
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateAddress(newAddress, "new")) {
      return;
    }

    setAddAddressLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      if (res.ok) {
        await fetchAddresses();
        handleHideAddAddressForm();
        toast.success("Address added successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add address");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setAddAddressLoading(false);
    }
  };

  const handleEditAddress = (id) => {
    setEditingAddressId(id);
    const addressToEdit = addresses.find((address) => address.id === id);
    if (addressToEdit) {
      setEditAddressData({
        address1: addressToEdit.address1,
        city: addressToEdit.city,
        area: addressToEdit.area,
        isDefault: addressToEdit.isDefault,
      });
      setSelectedCityEdit(addressToEdit.city);
      setAreasEdit(cityAreaMap[addressToEdit.city] || []);
    }
  };

  const handleUpdateAddressSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateAddress(editAddressData, "edit")) {
      return;
    }

    setUpdateAddressLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/addresses/${editingAddressId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editAddressData),
      });
      if (res.ok) {
        await fetchAddresses();
        setEditingAddressId(null);
        toast.success("Address updated successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update address");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setUpdateAddressLoading(false);
    }
  };

  const handleCancelEditAddress = () => {
    setEditingAddressId(null);
    setEditAddressErrors({});
  };

  const handleDeleteAddress = async (id) => {
    setDeleteAddressLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/customer/addresses/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          await fetchAddresses();
          toast.success("Address deleted successfully");
        } else {
          toast.error("Failed to delete address");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setDeleteAddressLoading(false);
      }
  };
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="my-account-content account-address">
      <h4 className="fw-semibold mb-20">Your addresses ({addresses.length || 0})</h4>
      <div className="widget-inner-address">
        <button className="tf-btn btn-add-address" onClick={handleShowAddAddressForm}>
          <span className="text-white">Add new address</span>
        </button>

        <form
          className="wd-form-address show-form-address mb-20"
          style={{ display: showAddAddressForm ? "block" : "none" }}
          onSubmit={handleAddAddressSubmit}
        >
          <div className="form-content">
            <fieldset>
              <label htmlFor="address1">Address 1 <span className="text-primary">*</span></label>
              <input
                type="text"
                id="address1"
                value={newAddress.address1}
                onChange={(e) => handleInputChange(e, "new")}
                className={newAddressErrors.address1 ? "is-invalid" : ""}
              />
              {newAddressErrors.address1 && (
                <div className="invalid-feedback">{newAddressErrors.address1}</div>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="city">City <span className="text-primary">*</span></label>
              <div className="tf-select">
                <select
                  id="city"
                  value={selectedCityNew}
                  onChange={handleCityChangeNew}
                  className={newAddressErrors.city ? "is-invalid" : ""}
                >
                  <option value="Select">Select</option>
                  <option value="Alabam">Alabam</option>
                  <option value="Alaska">Alaska</option>
                  <option value="California">California</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Washington">Washington</option>
                </select>
                {newAddressErrors.city && (
                  <div className="invalid-feedback">{newAddressErrors.city}</div>
                )}
              </div>
            </fieldset>
            <fieldset>
              <label htmlFor="area">Area <span className="text-primary">*</span></label>
              <div className="tf-select">
                <select
                  id="area"
                  disabled={selectedCityNew === "Select" || areasNew.length === 0}
                  value={newAddress.area}
                  onChange={(e) => handleInputChange(e, "new")}
                  className={newAddressErrors.area ? "is-invalid" : ""}
                >
                  <option value="">Select Area</option>
                  {areasNew.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {newAddressErrors.area && (
                  <div className="invalid-feedback">{newAddressErrors.area}</div>
                )}
              </div>
            </fieldset>
            <div className="tf-cart-checkbox">
              <input
                type="checkbox"
                name="set_def"
                className="tf-check"
                id="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) => handleInputChange(e, "new")}
              />
              <label htmlFor="isDefault">Set as default address</label>
            </div>
          </div>
          <div className="box-btn">
            <button className="tf-btn btn-large text-white" type="submit" disabled={addAddressLoading}>
              {addAddressLoading ? (
                <div>
                  Processing...{" "}
                  <div className="spinner-border spinner-border-sm text-white" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <span className="text-white">Add Address</span>
              )}
            </button>
            <button
              type="button"
              className="tf-btn btn-large btn-hide-address d-inline-flex"
              onClick={handleHideAddAddressForm}
            >
              <span className="text-white">Cancel</span>
            </button>
          </div>
        </form>

        {loading ? 
          <div className="p-4 d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          :
          <ul className="list-account-address tf-grid-layout md-col-2">
            {addresses.map((address, index) => (
              <li
                className={`account-address-item ${editingAddressId === address.id ? "editing" : ""}`}
                key={address.id}
              >
                <p className="title title-sidebar fw-semibold">
                  Address {index + 1} {address.isDefault && "(Default)"}
                </p>
                <div className="info-detail">
                  <div className="box-infor">
                    <p className="title-sidebar"><strong>Address:</strong> {address.address1}</p>
                    <p className="title-sidebar"><strong>City:</strong> {address.city}</p>
                    {address.area && <p className="title-sidebar"><strong>Area:</strong> {address.area}</p>}
                  </div>
                  <div className="box-btn">
                    <button
                      className="tf-btn btn-large btn-edit-address"
                      onClick={() => handleEditAddress(address.id)}
                      disabled={editingAddressId !== null}
                    >
                      <span className="text-white">Edit</span>
                    </button>
                    <button
                      className="tf-btn btn-large btn-delete-address text-white"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={editingAddressId !== null}
                    >
                      {deleteAddressLoading ? (
                        <div>
                          Processing...{" "}
                          <div className="spinner-border spinner-border-sm text-white" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-white">Delete</span>
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          }   
        {editingAddressId && (
          <form
            className="wd-form-address edit-form-address show"
            style={{ display: "block" }}
            onSubmit={handleUpdateAddressSubmit}
          >
            <div className="form-content">
              <fieldset>
                <label htmlFor="address1">Address 1 <span className="text-primary">*</span></label>
                <input
                  type="text"
                  id="address1"
                  value={editAddressData.address1}
                  onChange={(e) => handleInputChange(e, "edit")}
                  className={editAddressErrors.address1 ? "is-invalid" : ""}
                />
                {editAddressErrors.address1 && (
                  <div className="invalid-feedback">{editAddressErrors.address1}</div>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="city">City <span className="text-primary">*</span></label>
                <div className="tf-select">
                  <select
                    id="city"
                    value={selectedCityEdit}
                    onChange={handleCityChangeEdit}
                    className={editAddressErrors.city ? "is-invalid" : ""}
                  >
                    <option value="Select">Select</option>
                    <option value="Alabam">Alabam</option>
                    <option value="Alaska">Alaska</option>
                    <option value="California">California</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Washington">Washington</option>
                  </select>
                  {editAddressErrors.city && (
                    <div className="invalid-feedback">{editAddressErrors.city}</div>
                  )}
                </div>
              </fieldset>
              <fieldset>
                <label htmlFor="area">Area <span className="text-primary">*</span></label>
                <div className="tf-select">
                  <select
                    id="area"
                    disabled={selectedCityEdit === "Select" || areasEdit.length === 0}
                    value={editAddressData.area}
                    onChange={(e) => handleInputChange(e, "edit")}
                    className={editAddressErrors.area ? "is-invalid" : ""}
                  >
                    <option value="">Select Area</option>
                    {areasEdit.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {editAddressErrors.area && (
                    <div className="invalid-feedback">{editAddressErrors.area}</div>
                  )}
                </div>
              </fieldset>
              <div className="tf-cart-checkbox">
                <input
                  type="checkbox"
                  name="set_def"
                  className="tf-check"
                  id="isDefault"
                  checked={editAddressData.isDefault}
                  onChange={(e) => handleInputChange(e, "edit")}
                />
                <label htmlFor="isDefault">Set as default address</label>
              </div>
            </div>
            <div className="box-btn">
              <button className="tf-btn btn-large text-white" type="submit" disabled={updateAddressLoading}>
                {updateAddressLoading ? (
                  <div>
                    Processing...{" "}
                    <div className="spinner-border spinner-border-sm text-white" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-white">Update</span>
                )}
              </button>
              <button
                type="button"
                className="tf-btn btn-large btn-hide-edit-address d-inline-flex"
                onClick={handleCancelEditAddress}
              >
                <span className="text-white">Cancel</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}