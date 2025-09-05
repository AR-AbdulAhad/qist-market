"use client";
import React, { useState } from "react";

export default function Address() {
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "8500 Lorem Street",
      firstName: "Themesflat",
      lastName: "",
      company: "Company",
      address1: "8500 Lorem Street",
      city: "Punchbowl",
      region: "Chicago",
      zipCode: "55030",
      phone: "+8(800) 123 4567",
      isDefault: true,
    },
    {
      id: 2,
      title: "17 Yarran st",
      firstName: "Onsus",
      lastName: "",
      company: "Company",
      address1: "17 Yarran st",
      city: "Count",
      region: "Australia",
      zipCode: "9226",
      phone: "+6(800) 1234 3435",
      isDefault: false,
    },
  ]);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    city: "",
    region: "",
    zipCode: "",
    phone: "",
    isDefault: false,
  });

  const [editAddressData, setEditAddressData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    city: "",
    region: "",
    zipCode: "",
    phone: "",
    isDefault: false,
  });

  const handleShowAddAddressForm = () => {
    setShowAddAddressForm(true);
  };

  const handleHideAddAddressForm = () => {
    setShowAddAddressForm(false);
    setNewAddress({
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      city: "",
      region: "",
      zipCode: "",
      phone: "",
      isDefault: false,
    });
  };

  const handleInputChange = (e, formType = "new") => {
    const { id, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (formType === "new") {
      setNewAddress((prev) => ({ ...prev, [id]: newValue }));
    } else {
      setEditAddressData((prev) => ({ ...prev, [id]: newValue }));
    }
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !newAddress.firstName ||
      !newAddress.lastName ||
      !newAddress.address1 ||
      !newAddress.city ||
      !newAddress.region ||
      !newAddress.zipCode ||
      !newAddress.phone
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const newId =
      addresses.length > 0
        ? Math.max(...addresses.map((address) => address.id)) + 1
        : 1;
    const newAddressWithId = {
      ...newAddress,
      id: newId,
      title: newAddress.address1,
    };

    setAddresses((prev) => [...prev, newAddressWithId]);
    handleHideAddAddressForm();
  };

  const handleEditAddress = (id) => {
    setEditingAddressId(id);
    const addressToEdit = addresses.find((address) => address.id === id);
    if (addressToEdit) {
      setEditAddressData({
        firstName: addressToEdit.firstName,
        lastName: addressToEdit.lastName,
        company: addressToEdit.company,
        address1: addressToEdit.address1,
        city: addressToEdit.city,
        region: addressToEdit.region,
        zipCode: addressToEdit.zipCode,
        phone: addressToEdit.phone,
        isDefault: addressToEdit.isDefault,
      });
    }
  };

  const handleUpdateAddressSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !editAddressData.firstName ||
      !editAddressData.lastName ||
      !editAddressData.address1 ||
      !editAddressData.city ||
      !editAddressData.region ||
      !editAddressData.zipCode ||
      !editAddressData.phone
    ) {
      alert("Please fill in all required fields for the edited address.");
      return;
    }

    setAddresses((prev) =>
      prev.map((address) =>
        address.id === editingAddressId
          ? { ...address, ...editAddressData, title: editAddressData.address1 }
          : address
      )
    );
    setEditingAddressId(null);
  };

  const handleCancelEditAddress = () => {
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (confirmDelete) {
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    }
  };

  return (
    <div className="my-account-content account-address">
      <h4 className="fw-semibold mb-20">Your addresses ({addresses.length})</h4>
      <div className="widget-inner-address ">
        <button
          className="tf-btn btn-add-address"
          onClick={handleShowAddAddressForm}
        >
          <span className="text-white">Add new address</span>
        </button>

        <form
          action="#"
          className="wd-form-address show-form-address mb-20"
          style={{ display: showAddAddressForm ? "block" : "none" }}
          onSubmit={handleAddAddressSubmit}
        >
          <div className="form-content">
            <div className="cols">
              <fieldset>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  required
                  value={newAddress.firstName}
                  onChange={(e) => handleInputChange(e, "new")}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={newAddress.lastName}
                  onChange={(e) => handleInputChange(e, "new")}
                />
              </fieldset>
            </div>
            <fieldset>
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                value={newAddress.company}
                onChange={(e) => handleInputChange(e, "new")}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="address1">Address 1</label>
              <input
                type="text"
                id="address1"
                required
                value={newAddress.address1}
                onChange={(e) => handleInputChange(e, "new")}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                required
                value={newAddress.city}
                onChange={(e) => handleInputChange(e, "new")}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="region">Country/region</label>
              <input
                type="text"
                id="region"
                required
                value={newAddress.region}
                onChange={(e) => handleInputChange(e, "new")}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="zipCode">Postal/ZIP code</label>
              <input
                type="text"
                id="zipCode"
                required
                value={newAddress.zipCode}
                onChange={(e) => handleInputChange(e, "new")}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                required
                value={newAddress.phone}
                onChange={(e) => handleInputChange(e, "new")}
              />
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
            <button className="tf-btn btn-large" type="submit">
              <span className="text-white">Update</span>
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

        <ul className="list-account-address tf-grid-layout md-col-2">
          {addresses.map((address) => (
            <li
              className={`account-address-item ${
                editingAddressId === address.id ? "editing" : ""
              }`}
              key={address.id}
            >
              <p className="title title-sidebar fw-semibold">{address.title}</p>
              <div className="info-detail">
                <div className="box-infor">
                  <p className="title-sidebar">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="title-sidebar">{address.company}</p>
                  <p className="title-sidebar">{address.address1}</p>
                  <p className="title-sidebar">{address.city}</p>
                  <p className="title-sidebar">{address.region}</p>
                  <p className="title-sidebar">{address.zipCode}</p>
                  <p className="title-sidebar">{address.phone}</p>
                </div>
                <div className="box-btn">
                  <button
                    className="tf-btn btn-large btn-edit-address"
                    onClick={() => handleEditAddress(address.id)}
                    disabled={editingAddressId !== null} // Disable other edit buttons when one is active
                  >
                    <span className="text-white">Edit</span>
                  </button>
                  <button
                    className="tf-btn btn-large btn-delete-address"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={editingAddressId !== null} // Disable delete when edit is active
                  >
                    <span className="text-white">Delete</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {editingAddressId && (
          <form
            action="#"
            className="wd-form-address edit-form-address show"
            style={{ display: "block" }}
            onSubmit={handleUpdateAddressSubmit}
          >
            <div className="form-content">
              <div className="cols">
                <fieldset>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={editAddressData.firstName}
                    onChange={(e) => handleInputChange(e, "edit")}
                  />
                </fieldset>
                <fieldset>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={editAddressData.lastName}
                    onChange={(e) => handleInputChange(e, "edit")}
                  />
                </fieldset>
              </div>
              <fieldset>
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  value={editAddressData.company}
                  onChange={(e) => handleInputChange(e, "edit")}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="address1">Address 1</label>
                <input
                  type="text"
                  id="address1"
                  required
                  value={editAddressData.address1}
                  onChange={(e) => handleInputChange(e, "edit")}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  required
                  value={editAddressData.city}
                  onChange={(e) => handleInputChange(e, "edit")}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="region">Country/region</label>
                <input
                  type="text"
                  id="region"
                  required
                  value={editAddressData.region}
                  onChange={(e) => handleInputChange(e, "edit")}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="zipCode">Postal/ZIP code</label>
                <input
                  type="text"
                  id="zipCode"
                  required
                  value={editAddressData.zipCode}
                  onChange={(e) => handleInputChange(e, "edit")}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  required
                  value={editAddressData.phone}
                  onChange={(e) => handleInputChange(e, "edit")}
                />
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
              <button className="tf-btn btn-large" type="submit">
                <span className="text-white">Update</span>
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
