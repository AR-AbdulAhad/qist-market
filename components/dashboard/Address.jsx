"use client";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Define the city list as a constant to avoid duplication
const CITY_OPTIONS = [
  { value: "Islamabad", label: "Islamabad" },
  { value: "", label: "Punjab Cities", disabled: true },
  { value: "Ahmed Nager Chatha", label: "Ahmed Nager Chatha" },
  { value: "Ahmadpur East", label: "Ahmadpur East" },
  { value: "Ali Khan Abad", label: "Ali Khan Abad" },
  { value: "Alipur", label: "Alipur" },
  { value: "Arifwala", label: "Arifwala" },
  { value: "Attock", label: "Attock" },
  { value: "Bhera", label: "Bhera" },
  { value: "Bhalwal", label: "Bhalwal" },
  { value: "Bahawalnagar", label: "Bahawalnagar" },
  { value: "Bahawalpur", label: "Bahawalpur" },
  { value: "Bhakkar", label: "Bhakkar" },
  { value: "Burewala", label: "Burewala" },
  { value: "Chillianwala", label: "Chillianwala" },
  { value: "Chakwal", label: "Chakwal" },
  { value: "Chichawatni", label: "Chichawatni" },
  { value: "Chiniot", label: "Chiniot" },
  { value: "Chishtian", label: "Chishtian" },
  { value: "Daska", label: "Daska" },
  { value: "Darya Khan", label: "Darya Khan" },
  { value: "Dera Ghazi Khan", label: "Dera Ghazi Khan" },
  { value: "Dhaular", label: "Dhaular" },
  { value: "Dina", label: "Dina" },
  { value: "Dinga", label: "Dinga" },
  { value: "Dipalpur", label: "Dipalpur" },
  { value: "Faisalabad", label: "Faisalabad" },
  { value: "Ferozewala", label: "Ferozewala" },
  { value: "Fateh Jhang", label: "Fateh Jang" },
  { value: "Ghakhar Mandi", label: "Ghakhar Mandi" },
  { value: "Gojra", label: "Gojra" },
  { value: "Gujranwala", label: "Gujranwala" },
  { value: "Gujrat", label: "Gujrat" },
  { value: "Gujar Khan", label: "Gujar Khan" },
  { value: "Hafizabad", label: "Hafizabad" },
  { value: "Haroonabad", label: "Haroonabad" },
  { value: "Hasilpur", label: "Hasilpur" },
  { value: "Haveli Lakha", label: "Haveli Lakha" },
  { value: "Jatoi", label: "Jatoi" },
  { value: "Jalalpur", label: "Jalalpur" },
  { value: "Jattan", label: "Jattan" },
  { value: "Jampur", label: "Jampur" },
  { value: "Jaranwala", label: "Jaranwala" },
  { value: "Jhang", label: "Jhang" },
  { value: "Jhelum", label: "Jhelum" },
  { value: "Kalabagh", label: "Kalabagh" },
  { value: "Karor Lal Esan", label: "Karor Lal Esan" },
  { value: "Kasur", label: "Kasur" },
  { value: "Kamalia", label: "Kamalia" },
  { value: "Kamoke", label: "Kamoke" },
  { value: "Khanewal", label: "Khanewal" },
  { value: "Khanpur", label: "Khanpur" },
  { value: "Kharian", label: "Kharian" },
  { value: "Khushab", label: "Khushab" },
  { value: "Kot Addu", label: "Kot Addu" },
  { value: "Jauharabad", label: "Jauharabad" },
  { value: "Lahore", label: "Lahore" },
  { value: "Lalamusa", label: "Lalamusa" },
  { value: "Layyah", label: "Layyah" },
  { value: "Liaquat Pur", label: "Liaquat Pur" },
  { value: "Lodhran", label: "Lodhran" },
  { value: "Malakwal", label: "Malakwal" },
  { value: "Mamoori", label: "Mamoori" },
  { value: "Mailsi", label: "Mailsi" },
  { value: "Mandi Bahauddin", label: "Mandi Bahauddin" },
  { value: "Mian Channu", label: "Mian Channu" },
  { value: "Mianwali", label: "Mianwali" },
  { value: "Multan", label: "Multan" },
  { value: "Murree", label: "Murree" },
  { value: "Muridke", label: "Muridke" },
  { value: "Mianwali Bangla", label: "Mianwali Bangla" },
  { value: "Muzaffargarh", label: "Muzaffargarh" },
  { value: "Narowal", label: "Narowal" },
  { value: "Nankana Sahib", label: "Nankana Sahib" },
  { value: "Okara", label: "Okara" },
  { value: "Renala Khurd", label: "Renala Khurd" },
  { value: "Pakpattan", label: "Pakpattan" },
  { value: "Pattoki", label: "Pattoki" },
  { value: "Pir Mahal", label: "Pir Mahal" },
  { value: "Qaimpur", label: "Qaimpur" },
  { value: "Qila Didar Singh", label: "Qila Didar Singh" },
  { value: "Rabwah", label: "Rabwah" },
  { value: "Raiwind", label: "Raiwind" },
  { value: "Rajanpur", label: "Rajanpur" },
  { value: "Rahim Yar Khan", label: "Rahim Yar Khan" },
  { value: "Rawalpindi", label: "Rawalpindi" },
  { value: "Sadiqabad", label: "Sadiqabad" },
  { value: "Safdarabad", label: "Safdarabad" },
  { value: "Sahiwal", label: "Sahiwal" },
  { value: "Sangla Hill", label: "Sangla Hill" },
  { value: "Sarai Alamgir", label: "Sarai Alamgir" },
  { value: "Sargodha", label: "Sargodha" },
  { value: "Shakargarh", label: "Shakargarh" },
  { value: "Sheikhupura", label: "Sheikhupura" },
  { value: "Sialkot", label: "Sialkot" },
  { value: "Sohawa", label: "Sohawa" },
  { value: "Soianwala", label: "Soianwala" },
  { value: "Siranwali", label: "Siranwali" },
  { value: "Talagang", label: "Talagang" },
  { value: "Taxila", label: "Taxila" },
  { value: "Toba Tek Singh", label: "Toba Tek Singh" },
  { value: "Vehari", label: "Vehari" },
  { value: "Wah Cantonment", label: "Wah Cantonment" },
  { value: "Wazirabad", label: "Wazirabad" },
  { value: "", label: "Sindh Cities", disabled: true },
  { value: "Badin", label: "Badin" },
  { value: "Bhirkan", label: "Bhirkan" },
  { value: "Rajo Khanani", label: "Rajo Khanani" },
  { value: "Chak", label: "Chak" },
  { value: "Dadu", label: "Dadu" },
  { value: "Digri", label: "Digri" },
  { value: "Diplo", label: "Diplo" },
  { value: "Dokri", label: "Dokri" },
  { value: "Ghotki", label: "Ghotki" },
  { value: "Haala", label: "Haala" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Islamkot", label: "Islamkot" },
  { value: "Jacobabad", label: "Jacobabad" },
  { value: "Jamshoro", label: "Jamshoro" },
  { value: "Jungshahi", label: "Jungshahi" },
  { value: "Kandhkot", label: "Kandhkot" },
  { value: "Kandiaro", label: "Kandiaro" },
  { value: "Karachi", label: "Karachi" },
  { value: "Kashmore", label: "Kashmore" },
  { value: "Keti Bandar", label: "Keti Bandar" },
  { value: "Khairpur", label: "Khairpur" },
  { value: "Kotri", label: "Kotri" },
  { value: "Larkana", label: "Larkana" },
  { value: "Matiari", label: "Matiari" },
  { value: "Mehar", label: "Mehar" },
  { value: "Mirpur Khas", label: "Mirpur Khas" },
  { value: "Mithani", label: "Mithani" },
  { value: "Mithi", label: "Mithi" },
  { value: "Mehrabpur", label: "Mehrabpur" },
  { value: "Moro", label: "Moro" },
  { value: "Nagarparkar", label: "Nagarparkar" },
  { value: "Naudero", label: "Naudero" },
  { value: "Naushahro Feroze", label: "Naushahro Feroze" },
  { value: "Naushara", label: "Naushara" },
  { value: "Nawabshah", label: "Nawabshah" },
  { value: "Nazimabad", label: "Nazimabad" },
  { value: "Qambar", label: "Qambar" },
  { value: "Qasimabad", label: "Qasimabad" },
  { value: "Ranipur", label: "Ranipur" },
  { value: "Ratodero", label: "Ratodero" },
  { value: "Rohri", label: "Rohri" },
  { value: "Sakrand", label: "Sakrand" },
  { value: "Sanghar", label: "Sanghar" },
  { value: "Shahbandar", label: "Shahbandar" },
  { value: "Shahdadkot", label: "Shahdadkot" },
  { value: "Shahdadpur", label: "Shahdadpur" },
  { value: "Shahpur Chakar", label: "Shahpur Chakar" },
  { value: "Shikarpaur", label: "Shikarpaur" },
  { value: "Sukkur", label: "Sukkur" },
  { value: "Tangwani", label: "Tangwani" },
  { value: "Tando Adam Khan", label: "Tando Adam Khan" },
  { value: "Tando Allahyar", label: "Tando Allahyar" },
  { value: "Tando Muhammad Khan", label: "Tando Muhammad Khan" },
  { value: "Thatta", label: "Thatta" },
  { value: "Umerkot", label: "Umerkot" },
  { value: "Warah", label: "Warah" },
  { value: "", label: "Khyber Cities", disabled: true },
  { value: "Abbottabad", label: "Abbottabad" },
  { value: "Adezai", label: "Adezai" },
  { value: "Alpuri", label: "Alpuri" },
  { value: "Akora Khattak", label: "Akora Khattak" },
  { value: "Ayubia", label: "Ayubia" },
  { value: "Banda Daud Shah", label: "Banda Daud Shah" },
  { value: "Bannu", label: "Bannu" },
  { value: "Batkhela", label: "Batkhela" },
  { value: "Battagram", label: "Battagram" },
  { value: "Birote", label: "Birote" },
  { value: "Chakdara", label: "Chakdara" },
  { value: "Charsadda", label: "Charsadda" },
  { value: "Chitral", label: "Chitral" },
  { value: "Daggar", label: "Daggar" },
  { value: "Dargai", label: "Dargai" },
  { value: "Darya Khan", label: "Darya Khan" },
  { value: "Dera Ismail Khan", label: "Dera Ismail Khan" },
  { value: "Doaba", label: "Doaba" },
  { value: "Dir", label: "Dir" },
  { value: "Drosh", label: "Drosh" },
  { value: "Hangu", label: "Hangu" },
  { value: "Haripur", label: "Haripur" },
  { value: "Karak", label: "Karak" },
  { value: "Kohat", label: "Kohat" },
  { value: "Kulachi", label: "Kulachi" },
  { value: "Lakki Marwat", label: "Lakki Marwat" },
  { value: "Latamber", label: "Latamber" },
  { value: "Madyan", label: "Madyan" },
  { value: "Mansehra", label: "Mansehra" },
  { value: "Mardan", label: "Mardan" },
  { value: "Mastuj", label: "Mastuj" },
  { value: "Mingora", label: "Mingora" },
  { value: "Nowshera", label: "Nowshera" },
  { value: "Paharpur", label: "Paharpur" },
  { value: "Pabbi", label: "Pabbi" },
  { value: "Peshawar", label: "Peshawar" },
  { value: "Saidu Sharif", label: "Saidu Sharif" },
  { value: "Shorkot", label: "Shorkot" },
  { value: "Shewa Adda", label: "Shewa Adda" },
  { value: "Swabi", label: "Swabi" },
  { value: "Swat", label: "Swat" },
  { value: "Tangi", label: "Tangi" },
  { value: "Tank", label: "Tank" },
  { value: "Thall", label: "Thall" },
  { value: "Timergara", label: "Timergara" },
  { value: "Tordher", label: "Tordher" },
  { value: "", label: "Balochistan Cities", disabled: true },
  { value: "Awaran", label: "Awaran" },
  { value: "Barkhan", label: "Barkhan" },
  { value: "Chagai", label: "Chagai" },
  { value: "Dera Bugti", label: "Dera Bugti" },
  { value: "Gwadar", label: "Gwadar" },
  { value: "Harnai", label: "Harnai" },
  { value: "Jafarabad", label: "Jafarabad" },
  { value: "Jhal Magsi", label: "Jhal Magsi" },
  { value: "Kacchi", label: "Kacchi" },
  { value: "Kalat", label: "Kalat" },
  { value: "Kech", label: "Kech" },
  { value: "Kharan", label: "Kharan" },
  { value: "Khuzdar", label: "Khuzdar" },
  { value: "Killa Abdullah", label: "Killa Abdullah" },
  { value: "Killa Saifullah", label: "Killa Saifullah" },
  { value: "Kohlu", label: "Kohlu" },
  { value: "Lasbela", label: "Lasbela" },
  { value: "Lehri", label: "Lehri" },
  { value: "Loralai", label: "Loralai" },
  { value: "Mastung", label: "Mastung" },
  { value: "Musakhel", label: "Musakhel" },
  { value: "Nasirabad", label: "Nasirabad" },
  { value: "Nushki", label: "Nushki" },
  { value: "Panjgur", label: "Panjgur" },
  { value: "Pishin Valley", label: "Pishin Valley" },
  { value: "Quetta", label: "Quetta" },
  { value: "Sherani", label: "Sherani" },
  { value: "Sibi", label: "Sibi" },
  { value: "Sohbatpur", label: "Sohbatpur" },
  { value: "Washuk", label: "Washuk" },
  { value: "Zhob", label: "Zhob" },
  { value: "Ziarat", label: "Ziarat" },
];

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
  const [selectedCityNew, setSelectedCityNew] = useState("");
  const [selectedCityEdit, setSelectedCityEdit] = useState("");

  const [newAddress, setNewAddress] = useState({
    address1: "",
    city: "",
    isDefault: false,
  });

  const [editAddressData, setEditAddressData] = useState({
    address1: "",
    city: "",
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
    if (!formData.city) {
      newErrors.city = "Please select a city";
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
      isDefault: false,
    });
    setNewAddressErrors({});
    setSelectedCityNew("");
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
    setNewAddress((prev) => ({ ...prev, city }));
    setNewAddressErrors((prev) => ({ ...prev, city: "" }));
  };

  const handleCityChangeEdit = (e) => {
    const city = e.target.value;
    setSelectedCityEdit(city);
    setEditAddressData((prev) => ({ ...prev, city }));
    setEditAddressErrors((prev) => ({ ...prev, city: "" }));
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
        isDefault: addressToEdit.isDefault,
      });
      setSelectedCityEdit(addressToEdit.city);
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
    setSelectedCityEdit("");
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
                  name="Location"
                  id="city"
                  value={selectedCityNew}
                  onChange={handleCityChangeNew}
                  className={newAddressErrors.city ? "is-invalid" : ""}
                >
                  <option value="" disabled>
                    Select The City
                  </option>
                  {CITY_OPTIONS.map((option, index) => (
                    <option
                      key={index}
                      value={option.value}
                      disabled={option.disabled || false}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                {newAddressErrors.city && (
                  <div className="invalid-feedback">{newAddressErrors.city}</div>
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

        {loading ? (
          <div className="p-4 d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
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
        )}
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
                    name="Location"
                    id="city"
                    value={selectedCityEdit}
                    onChange={handleCityChangeEdit}
                    className={editAddressErrors.city ? "is-invalid" : ""}
                  >
                    <option value="" disabled>
                      Select The City
                    </option>
                    {CITY_OPTIONS.map((option, index) => (
                      <option
                        key={index}
                        value={option.value}
                        disabled={option.disabled || false}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {editAddressErrors.city && (
                    <div className="invalid-feedback">{editAddressErrors.city}</div>
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