"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Checkout() {
  const { user, token } = useContext(AuthContext);
  const [cartData, setCartData] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const router = useRouter();

  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const cnicRef = useRef(null);
  const cityRef = useRef(null);
  const addressRef = useRef(null);

  const updateCartData = () => {
    try {
      const data = Cookies.get("cartData");
      if (data) {
        setCartData(JSON.parse(data));
      } else {
        setCartData(null);
      }
    } catch (error) {
      console.error("Error parsing cartData cookie:", error);
      setCartData(null);
    }
  };

  useEffect(() => {
    updateCartData();

    const intervalId = setInterval(() => {
      updateCartData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (user && token) {
      emailRef.current.value = user.email;
      phoneRef.current.value = user.phone || "";
      firstNameRef.current.value = user.firstName || "";
      lastNameRef.current.value = user.lastName || "";
      cnicRef.current.value = user.cnic || "";

      const fetchDefaultAddress = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/customer/addresses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const addresses = await res.json();
            const defaultAddr = addresses.find((addr) => addr.isDefault);
            if (defaultAddr) {
              setDefaultAddress(defaultAddr);
              setUseDefaultAddress(true);
              addressRef.current.value = defaultAddr.address1;
              const city = defaultAddr.city;
              setSelectedCity(city);
              cityRef.current.value = city;
            }
          }
        } catch (error) {
          console.error("Error fetching default address:", error);
        }
      };
      fetchDefaultAddress();
    }
  }, [user, token]);

  useEffect(() => {
    const data = Cookies.get("cartData");
    if (!data) {
      router.push("/shop-cart");
    }
  }, [router]);

  const removeItem = () => {
    Cookies.remove("cartData", { path: "/" });
    setCartData(null);
  };

  const handleCityChange = (e) => {
    if (!useDefaultAddress) {
      const city = e.target.value;
      setSelectedCity(city);
      validateField("city", city);
    }
  };

  const handleDefaultAddressChange = (e) => {
    const isChecked = e.target.checked;
    setUseDefaultAddress(isChecked);
    if (isChecked && defaultAddress) {
      addressRef.current.value = defaultAddress.address1;
      cityRef.current.value = defaultAddress.city;
      setSelectedCity(defaultAddress.city);
    } else {
      addressRef.current.value = "";
      cityRef.current.value = "";
      setSelectedCity("");
    }
  };

  const validateField = (fieldName, value) => {
    let error = null;
    switch (fieldName) {
      case "email":
        if (!value || !/\S+@\S+\.\S+/.test(value)) {
          error = "A valid email is required";
        }
        break;
      case "phone":
        if (!value || !/^\d{11,}$/.test(value)) {
          error = "A valid phone number (minimum 11 digits) is required";
        }
        break;
      case "firstName":
        if (!value) {
          error = "First name is required";
        }
        break;
      case "lastName":
        if (!value) {
          error = "Last name is required";
        }
        break;
      case "cnic":
        if (!value || !/^\d{13}$/.test(value)) {
          error = "A valid 13-digit CNIC number is required";
        }
        break;
      case "city":
        if (!value) {
          error = "City selection is required";
        }
        break;
      case "address":
        if (!value) {
          error = "Address is required";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "A valid email is required";
    }
    if (!formData.phone || !/^\d{11,}$/.test(formData.phone)) {
      newErrors.phone = "A valid phone number (minimum 11 digits) is required";
    }
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.cnic || !/^\d{13}$/.test(formData.cnic)) {
      newErrors.cnic = "A valid 13-digit CNIC number is required";
    }
    if (!formData.city) {
      newErrors.city = "City selection is required";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!formData.productName) {
      newErrors.productName = "Product name is required";
    }
    if (isNaN(formData.totalDealValue) || formData.totalDealValue < 0) {
      newErrors.totalDealValue = "Total deal value must be a non-negative number";
    }
    if (isNaN(formData.advanceAmount) || formData.advanceAmount < 0) {
      newErrors.advanceAmount = "Advance amount must be a non-negative number";
    }
    if (isNaN(formData.monthlyAmount) || formData.monthlyAmount < 0) {
      newErrors.monthlyAmount = "Monthly amount must be a non-negative number";
    }
    if (!Number.isInteger(formData.months) || formData.months < 0) {
      newErrors.months = "Months must be a non-negative integer";
    }
    return newErrors;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!cartData || !cartData.productName || !cartData.selectedPlan) {
      setErrors({ api: "Cart data is incomplete or missing" });
      setIsLoading(false);
      return;
    }
    const { productName, selectedPlan } = cartData;
    const requiredPlanFields = ["totalPrice", "advance", "monthlyAmount", "months"];
    for (const field of requiredPlanFields) {
      if (
        selectedPlan[field] === undefined ||
        selectedPlan[field] === null ||
        isNaN(selectedPlan[field]) ||
        selectedPlan[field] < 0
      ) {
        setErrors({ api: `Invalid plan data: ${field} is missing or invalid` });
        setIsLoading(false);
        return;
      }
    }

    const formData = {
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      cnic: cnicRef.current.value,
      city: cityRef.current.value,
      address: addressRef.current.value,
      orderNotes: document.querySelector("textarea").value,
      paymentMethod: "Advance cash on delivery",
      productName: productName,
      totalDealValue: selectedPlan.totalPrice,
      advanceAmount: selectedPlan.advance,
      monthlyAmount: selectedPlan.monthlyAmount,
      months: selectedPlan.months,
      customerID: user ? user.customerId : null,
    };

    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const fieldRefs = {
        email: emailRef,
        phone: phoneRef,
        firstName: firstNameRef,
        lastName: lastNameRef,
        cnic: cnicRef,
        city: cityRef,
        address: addressRef,
      };
      fieldRefs[firstErrorField]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const orderData = await response.json();
        sessionStorage.setItem("orderData", JSON.stringify(orderData));
        Cookies.remove("cartData", { path: "/" });
        router.push("/order-details");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        setErrors({
          api: errorData.error || "Failed to create order",
          details: errorData.details,
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors({
        api: "Failed to connect to the server",
        details: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="tf-sp-2">
      <div className="container">
        <div className="checkout-status tf-sp-2 pt-0">
          <div className="checkout-wrap">
            <span className="checkout-bar next" />
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-1" />
              </span>
              <Link href={`/shop-cart`} className="link body-text-3">
                Shopping Cart
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-2" />
              </span>
              <Link href={`/checkout`} className="text-secondary link body-text-3">
                Shopping &amp; Checkout
              </Link>
            </div>
            <div className="step-payment">
              <span className="icon">
                <i className="icon-shop-cart-3" />
              </span>
              <Link href={`/order-details`} className="link body-text-3">
                Confirmation
              </Link>
            </div>
          </div>
        </div>
        <div className="tf-checkout-wrap flex-lg-nowrap">
          <div className="page-checkout">
            <div className="wrap">
              <h5 className="title has-account">
                <span className="fw-semibold">Contact</span>
              </h5>
              <form className="form-checkout-contact">
                <label className="body-md-2 fw-semibold">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  className="def"
                  type="email"
                  placeholder="Your valid email"
                  ref={emailRef}
                  required
                  onChange={(e) => validateField("email", e.target.value)}
                />
                {errors.email && (
                  <p className="caption text-danger">{errors.email}</p>
                )}
                <p className="caption text-main-2 font-2">
                  Order information will be sent to your email
                </p>
              </form>
              <form className="form-checkout-contact mt-3">
                <label className="body-md-2 fw-semibold">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <input
                  className="def"
                  type="number"
                  placeholder="Your valid contact"
                  ref={phoneRef}
                  required
                  onChange={(e) => validateField("phone", e.target.value)}
                />
                {errors.phone && (
                  <p className="caption text-danger">{errors.phone}</p>
                )}
              </form>
            </div>
            <div className="wrap">
              <h5 className="title fw-semibold">Delivery</h5>
              <form action="#" className="def">
                <div className="cols">
                  <fieldset>
                    <label>
                      First Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      ref={firstNameRef}
                      required
                      onChange={(e) => validateField("firstName", e.target.value)}
                    />
                    {errors.firstName && (
                      <p className="caption text-danger">{errors.firstName}</p>
                    )}
                  </fieldset>
                  <fieldset>
                    <label>
                      Last Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      ref={lastNameRef}
                      required
                      onChange={(e) => validateField("lastName", e.target.value)}
                    />
                    {errors.lastName && (
                      <p className="caption text-danger">{errors.lastName}</p>
                    )}
                  </fieldset>
                </div>
                <fieldset>
                  <label>
                    CNIC Number <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="42xxxxxxxxxxx"
                    ref={cnicRef}
                    required
                    onChange={(e) => validateField("cnic", e.target.value)}
                  />
                  {errors.cnic && (
                    <p className="caption text-danger">{errors.cnic}</p>
                  )}
                </fieldset>
                {defaultAddress && (
                  <div className="tf-cart-checkbox mb-3">
                    <input
                      type="checkbox"
                      name="use_default_address"
                      className="tf-check"
                      id="useDefaultAddress"
                      checked={useDefaultAddress}
                      onChange={handleDefaultAddressChange}
                    />
                    <label htmlFor="useDefaultAddress">Use default address</label>
                  </div>
                )}
                <div className="cols">
                  <fieldset>
                    <label>
                      City <span className="text-primary">*</span>
                    </label>
                    {useDefaultAddress && defaultAddress ? (
                      <input
                        type="text"
                        ref={cityRef}
                        value={defaultAddress.city}
                        readOnly
                        disabled
                        className="def"
                        onChange={(e) => validateField("city", e.target.value)}
                      />
                    ) : (
                      <div className="tf-select">
                        <select
                          name="Location"
                          id="Location"
                          ref={cityRef}
                          value={selectedCity}
                          onChange={handleCityChange}
                          required
                        >
                          <option value="" disabled>
                            Select The City
                          </option>
                          <option value="Islamabad">Islamabad</option>
                          <option value="" disabled>
                            Punjab Cities
                          </option>
                          <option value="Ahmed Nager Chatha">Ahmed Nager Chatha</option>
                          <option value="Ahmadpur East">Ahmadpur East</option>
                          <option value="Ali Khan Abad">Ali Khan Abad</option>
                          <option value="Alipur">Alipur</option>
                          <option value="Arifwala">Arifwala</option>
                          <option value="Attock">Attock</option>
                          <option value="Bhera">Bhera</option>
                          <option value="Bhalwal">Bhalwal</option>
                          <option value="Bahawalnagar">Bahawalnagar</option>
                          <option value="Bahawalpur">Bahawalpur</option>
                          <option value="Bhakkar">Bhakkar</option>
                          <option value="Burewala">Burewala</option>
                          <option value="Chillianwala">Chillianwala</option>
                          <option value="Chakwal">Chakwal</option>
                          <option value="Chichawatni">Chichawatni</option>
                          <option value="Chiniot">Chiniot</option>
                          <option value="Chishtian">Chishtian</option>
                          <option value="Daska">Daska</option>
                          <option value="Darya Khan">Darya Khan</option>
                          <option value="Dera Ghazi Khan">Dera Ghazi Khan</option>
                          <option value="Dhaular">Dhaular</option>
                          <option value="Dina">Dina</option>
                          <option value="Dinga">Dinga</option>
                          <option value="Dipalpur">Dipalpur</option>
                          <option value="Faisalabad">Faisalabad</option>
                          <option value="Ferozewala">Ferozewala</option>
                          <option value="Fateh Jhang">Fateh Jang</option>
                          <option value="Ghakhar Mandi">Ghakhar Mandi</option>
                          <option value="Gojra">Gojra</option>
                          <option value="Gujranwala">Gujranwala</option>
                          <option value="Gujrat">Gujrat</option>
                          <option value="Gujar Khan">Gujar Khan</option>
                          <option value="Hafizabad">Hafizabad</option>
                          <option value="Haroonabad">Haroonabad</option>
                          <option value="Hasilpur">Hasilpur</option>
                          <option value="Haveli Lakha">Haveli Lakha</option>
                          <option value="Jatoi">Jatoi</option>
                          <option value="Jalalpur">Jalalpur</option>
                          <option value="Jattan">Jattan</option>
                          <option value="Jampur">Jampur</option>
                          <option value="Jaranwala">Jaranwala</option>
                          <option value="Jhang">Jhang</option>
                          <option value="Jhelum">Jhelum</option>
                          <option value="Kalabagh">Kalabagh</option>
                          <option value="Karor Lal Esan">Karor Lal Esan</option>
                          <option value="Kasur">Kasur</option>
                          <option value="Kamalia">Kamalia</option>
                          <option value="Kamoke">Kamoke</option>
                          <option value="Khanewal">Khanewal</option>
                          <option value="Khanpur">Khanpur</option>
                          <option value="Kharian">Kharian</option>
                          <option value="Khushab">Khushab</option>
                          <option value="Kot Addu">Kot Addu</option>
                          <option value="Jauharabad">Jauharabad</option>
                          <option value="Lahore">Lahore</option>
                          <option value="Lalamusa">Lalamusa</option>
                          <option value="Layyah">Layyah</option>
                          <option value="Liaquat Pur">Liaquat Pur</option>
                          <option value="Lodhran">Lodhran</option>
                          <option value="Malakwal">Malakwal</option>
                          <option value="Mamoori">Mamoori</option>
                          <option value="Mailsi">Mailsi</option>
                          <option value="Mandi Bahauddin">Mandi Bahauddin</option>
                          <option value="Mian Channu">Mian Channu</option>
                          <option value="Mianwali">Mianwali</option>
                          <option value="Multan">Multan</option>
                          <option value="Murree">Murree</option>
                          <option value="Muridke">Muridke</option>
                          <option value="Mianwali Bangla">Mianwali Bangla</option>
                          <option value="Muzaffargarh">Muzaffargarh</option>
                          <option value="Narowal">Narowal</option>
                          <option value="Nankana Sahib">Nankana Sahib</option>
                          <option value="Okara">Okara</option>
                          <option value="Renala Khurd">Renala Khurd</option>
                          <option value="Pakpattan">Pakpattan</option>
                          <option value="Pattoki">Pattoki</option>
                          <option value="Pir Mahal">Pir Mahal</option>
                          <option value="Qaimpur">Qaimpur</option>
                          <option value="Qila Didar Singh">Qila Didar Singh</option>
                          <option value="Rabwah">Rabwah</option>
                          <option value="Raiwind">Raiwind</option>
                          <option value="Rajanpur">Rajanpur</option>
                          <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                          <option value="Rawalpindi">Rawalpindi</option>
                          <option value="Sadiqabad">Sadiqabad</option>
                          <option value="Safdarabad">Safdarabad</option>
                          <option value="Sahiwal">Sahiwal</option>
                          <option value="Sangla Hill">Sangla Hill</option>
                          <option value="Sarai Alamgir">Sarai Alamgir</option>
                          <option value="Sargodha">Sargodha</option>
                          <option value="Shakargarh">Shakargarh</option>
                          <option value="Sheikhupura">Sheikhupura</option>
                          <option value="Sialkot">Sialkot</option>
                          <option value="Sohawa">Sohawa</option>
                          <option value="Soianwala">Soianwala</option>
                          <option value="Siranwali">Siranwali</option>
                          <option value="Talagang">Talagang</option>
                          <option value="Taxila">Taxila</option>
                          <option value="Toba Tek Singh">Toba Tek Singh</option>
                          <option value="Vehari">Vehari</option>
                          <option value="Wah Cantonment">Wah Cantonment</option>
                          <option value="Wazirabad">Wazirabad</option>
                          <option value="" disabled>
                            Sindh Cities
                          </option>
                          <option value="Badin">Badin</option>
                          <option value="Bhirkan">Bhirkan</option>
                          <option value="Rajo Khanani">Rajo Khanani</option>
                          <option value="Chak">Chak</option>
                          <option value="Dadu">Dadu</option>
                          <option value="Digri">Digri</option>
                          <option value="Diplo">Diplo</option>
                          <option value="Dokri">Dokri</option>
                          <option value="Ghotki">Ghotki</option>
                          <option value="Haala">Haala</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Islamkot">Islamkot</option>
                          <option value="Jacobabad">Jacobabad</option>
                          <option value="Jamshoro">Jamshoro</option>
                          <option value="Jungshahi">Jungshahi</option>
                          <option value="Kandhkot">Kandhkot</option>
                          <option value="Kandiaro">Kandiaro</option>
                          <option value="Karachi">Karachi</option>
                          <option value="Kashmore">Kashmore</option>
                          <option value="Keti Bandar">Keti Bandar</option>
                          <option value="Khairpur">Khairpur</option>
                          <option value="Kotri">Kotri</option>
                          <option value="Larkana">Larkana</option>
                          <option value="Matiari">Matiari</option>
                          <option value="Mehar">Mehar</option>
                          <option value="Mirpur Khas">Mirpur Khas</option>
                          <option value="Mithani">Mithani</option>
                          <option value="Mithi">Mithi</option>
                          <option value="Mehrabpur">Mehrabpur</option>
                          <option value="Moro">Moro</option>
                          <option value="Nagarparkar">Nagarparkar</option>
                          <option value="Naudero">Naudero</option>
                          <option value="Naushahro Feroze">Naushahro Feroze</option>
                          <option value="Naushara">Naushara</option>
                          <option value="Nawabshah">Nawabshah</option>
                          <option value="Nazimabad">Nazimabad</option>
                          <option value="Qambar">Qambar</option>
                          <option value="Qasimabad">Qasimabad</option>
                          <option value="Ranipur">Ranipur</option>
                          <option value="Ratodero">Ratodero</option>
                          <option value="Rohri">Rohri</option>
                          <option value="Sakrand">Sakrand</option>
                          <option value="Sanghar">Sanghar</option>
                          <option value="Shahbandar">Shahbandar</option>
                          <option value="Shahdadkot">Shahdadkot</option>
                          <option value="Shahdadpur">Shahdadpur</option>
                          <option value="Shahpur Chakar">Shahpur Chakar</option>
                          <option value="Shikarpaur">Shikarpaur</option>
                          <option value="Sukkur">Sukkur</option>
                          <option value="Tangwani">Tangwani</option>
                          <option value="Tando Adam Khan">Tando Adam Khan</option>
                          <option value="Tando Allahyar">Tando Allahyar</option>
                          <option value="Tando Muhammad Khan">Tando Muhammad Khan</option>
                          <option value="Thatta">Thatta</option>
                          <option value="Umerkot">Umerkot</option>
                          <option value="Warah">Warah</option>
                          <option value="" disabled>
                            Khyber Cities
                          </option>
                          <option value="Abbottabad">Abbottabad</option>
                          <option value="Adezai">Adezai</option>
                          <option value="Alpuri">Alpuri</option>
                          <option value="Akora Khattak">Akora Khattak</option>
                          <option value="Ayubia">Ayubia</option>
                          <option value="Banda Daud Shah">Banda Daud Shah</option>
                          <option value="Bannu">Bannu</option>
                          <option value="Batkhela">Batkhela</option>
                          <option value="Battagram">Battagram</option>
                          <option value="Birote">Birote</option>
                          <option value="Chakdara">Chakdara</option>
                          <option value="Charsadda">Charsadda</option>
                          <option value="Chitral">Chitral</option>
                          <option value="Daggar">Daggar</option>
                          <option value="Dargai">Dargai</option>
                          <option value="Darya Khan">Darya Khan</option>
                          <option value="Dera Ismail Khan">Dera Ismail Khan</option>
                          <option value="Doaba">Doaba</option>
                          <option value="Dir">Dir</option>
                          <option value="Drosh">Drosh</option>
                          <option value="Hangu">Hangu</option>
                          <option value="Haripur">Haripur</option>
                          <option value="Karak">Karak</option>
                          <option value="Kohat">Kohat</option>
                          <option value="Kulachi">Kulachi</option>
                          <option value="Lakki Marwat">Lakki Marwat</option>
                          <option value="Latamber">Latamber</option>
                          <option value="Madyan">Madyan</option>
                          <option value="Mansehra">Mansehra</option>
                          <option value="Mardan">Mardan</option>
                          <option value="Mastuj">Mastuj</option>
                          <option value="Mingora">Mingora</option>
                          <option value="Nowshera">Nowshera</option>
                          <option value="Paharpur">Paharpur</option>
                          <option value="Pabbi">Pabbi</option>
                          <option value="Peshawar">Peshawar</option>
                          <option value="Saidu Sharif">Saidu Sharif</option>
                          <option value="Shorkot">Shorkot</option>
                          <option value="Shewa Adda">Shewa Adda</option>
                          <option value="Swabi">Swabi</option>
                          <option value="Swat">Swat</option>
                          <option value="Tangi">Tangi</option>
                          <option value="Tank">Tank</option>
                          <option value="Thall">Thall</option>
                          <option value="Timergara">Timergara</option>
                          <option value="Tordher">Tordher</option>
                          <option value="" disabled>
                            Balochistan Cities
                          </option>
                          <option value="Awaran">Awaran</option>
                          <option value="Barkhan">Barkhan</option>
                          <option value="Chagai">Chagai</option>
                          <option value="Dera Bugti">Dera Bugti</option>
                          <option value="Gwadar">Gwadar</option>
                          <option value="Harnai">Harnai</option>
                          <option value="Jafarabad">Jafarabad</option>
                          <option value="Jhal Magsi">Jhal Magsi</option>
                          <option value="Kacchi">Kacchi</option>
                          <option value="Kalat">Kalat</option>
                          <option value="Kech">Kech</option>
                          <option value="Kharan">Kharan</option>
                          <option value="Khuzdar">Khuzdar</option>
                          <option value="Killa Abdullah">Killa Abdullah</option>
                          <option value="Killa Saifullah">Killa Saifullah</option>
                          <option value="Kohlu">Kohlu</option>
                          <option value="Lasbela">Lasbela</option>
                          <option value="Lehri">Lehri</option>
                          <option value="Loralai">Loralai</option>
                          <option value="Mastung">Mastung</option>
                          <option value="Musakhel">Musakhel</option>
                          <option value="Nasirabad">Nasirabad</option>
                          <option value="Nushki">Nushki</option>
                          <option value="Panjgur">Panjgur</option>
                          <option value="Pishin Valley">Pishin Valley</option>
                          <option value="Quetta">Quetta</option>
                          <option value="Sherani">Sherani</option>
                          <option value="Sibi">Sibi</option>
                          <option value="Sohbatpur">Sohbatpur</option>
                          <option value="Washuk">Washuk</option>
                          <option value="Zhob">Zhob</option>
                          <option value="Ziarat">Ziarat</option>
                        </select>
                        {errors.city && (
                          <p className="caption text-danger">{errors.city}</p>
                        )}
                      </div>
                    )}
                  </fieldset>
                </div>
                <fieldset>
                  <label>
                    Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your detailed address"
                    ref={addressRef}
                    required
                    readOnly={useDefaultAddress && defaultAddress}
                    onChange={(e) => validateField("address", e.target.value)}
                  />
                  {errors.address && (
                    <p className="caption text-danger">{errors.address}</p>
                  )}
                </fieldset>
                <fieldset>
                  <label>Order Notes (optional)</label>
                  <textarea placeholder="Note on your order" defaultValue={""} />
                </fieldset>
              </form>
            </div>
            <div className="wrap">
              <h5 className="title fw-semibold">Payment</h5>
              <div className="form-payment">
                <div className="payment-box">
                  <p className="body-md-2 fw-semibold">Advance cash on delivery</p>
                </div>
                <div className="box-btn">
                  <button
                    onClick={handlePlaceOrder}
                    className="tf-btn w-100"
                    type="button"
                    disabled={isLoading}
                  >
                    <span className="text-white">
                      {isLoading ? "Placing order..." : "Place order"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flat-sidebar-checkout">
            <div className="sidebar-checkout-content">
              <h5 className="fw-semibold">Order Summary</h5>
              {cartData ? (
                <ul className="list-product">
                  <li className="item-product">
                    <a href="#" className="img-product">
                      <Image
                        alt=""
                        src={cartData.imageUrl || "/images/product-placeholder/product-placeholder-image.png"}
                        width={500}
                        height={500}
                      />
                    </a>
                    <div className="content-box">
                      <a
                        href={`/product-details/${cartData.productSlug}`}
                        className="link-secondary body-md-2 fw-semibold"
                      >
                        {cartData.productName}
                      </a>
                      <p className="body-md-2 text-main-2 fw-semibold">
                        Total Deal Value Rs. {cartData.selectedPlan.totalPrice.toLocaleString()}
                      </p>
                      <p className="body-md-2 text-main-2">
                        Plan: Rs {cartData.selectedPlan.monthlyAmount.toLocaleString()} x{" "}
                        {cartData.selectedPlan.months} months
                      </p>
                      <div className="body-md-2 text-main-2">
                        <button
                          className="text-primary link check-btn"
                          onClick={removeItem}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              ) : (
                <div className="w-100 d-flex justify-content-center align-items-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              <ul className="sec-total-price">
                <li>
                  <span className="body-text-3">Advance Amount</span>
                  <span className="body-text-3">
                    Rs. {cartData?.selectedPlan?.advance.toLocaleString() || "0"}
                  </span>
                </li>
                <li>
                  <span className="body-text-3">Monthly Amount</span>
                  <span className="body-text-3">
                    Rs. {cartData?.selectedPlan?.monthlyAmount.toLocaleString() || "0"} / for{" "}
                    {cartData?.selectedPlan?.months} Months
                  </span>
                </li>
                <li>
                  <span className="body-md-2 fw-semibold">Total</span>
                  <span className="body-md-2 fw-semibold text-primary">
                    Rs. {cartData?.selectedPlan?.advance.toLocaleString() || "0"}
                  </span>
                </li>
                <li>
                  <span className="body-text-3">Shipping</span>
                  <span className="body-text-3">Free shipping</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}