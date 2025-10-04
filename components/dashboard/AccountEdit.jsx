"use client";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AccountEdit() {
  const { token, user, refreshUser, logout } = useContext(AuthContext);
  const router = useRouter();
  const [profile, setProfile] = useState({ firstName: "", lastName: "", phone: "", alternativePhone: "", email: "", cnic: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        alternativePhone: user.alternativePhone || "",
        email: user.email || "",
        cnic: user.cnic || "",
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const validateProfile = () => {
    const newErrors = {};

    if (!profile.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!profile.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!user.cnic) {
      if (!profile.cnic) {
        newErrors.cnic = "CNIC is required";
      } else if (!/^\d{13}$/.test(profile.cnic)) {
        newErrors.cnic = "CNIC must be exactly 13 digits";
      }
    }

    if (!user.email && profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters long";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwordData.newPassword)) {
      newErrors.newPassword = "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (!passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
    setProfileErrors({ ...profileErrors, [e.target.id]: "" });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.id]: e.target.value });
    setPasswordErrors({ ...passwordErrors, [e.target.id]: "" });
  };

  const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmNewPasswordVisibility = () => setShowConfirmNewPassword(!showConfirmNewPassword);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateProfile()) {
      return;
    }
    setProfileLoading(true);

    const payload = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      alternativePhone: profile.alternativePhone,
    };
    if (!user.cnic) {
      payload.cnic = profile.cnic;
    }
    if (!user.email && profile.email) {
      payload.email = profile.email;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Profile updated. Please log in again to continue.");
        await logout();
        router.push("/");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validatePassword()) {
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/customer/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(passwordData),
      });
      if (res.ok) {
        toast.success("Password changed. Please log in again to continue.");
        await logout();
        router.push("/");
        setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
        setPasswordErrors({});
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmNewPassword(false);
      } else {
        toast.error("Failed to change password");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="my-account-content account-details">
      <div className="wrap">
        <h4 className="fw-semibold mb-20">Information</h4>
        <form onSubmit={handleProfileSubmit} className="form-account-details">
          <div className="cols mb-3">
            <fieldset>
              <label htmlFor="firstName" className="fw-semibold body-md-2">
                First Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                placeholder="First Name (e.g., Abdul)"
                className={profileErrors.firstName ? "is-invalid" : ""}
              />
              {profileErrors.firstName && (
                <div className="invalid-feedback">{profileErrors.firstName}</div>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="lastName" className="fw-semibold body-md-2">
                Last Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                placeholder="Last Name (e.g., Ahad)"
                className={profileErrors.lastName ? "is-invalid" : ""}
              />
              {profileErrors.lastName && (
                <div className="invalid-feedback">{profileErrors.lastName}</div>
              )}
            </fieldset>
          </div>
          <div className="cols mb-3">
            <fieldset>
              <label htmlFor="email" className="fw-semibold body-md-2">
                Email Address (optional)
              </label>
              <input
                type="email"
                id="email"
                value={profile.email}
                onChange={user.email ? null : handleProfileChange}
                disabled={!!user.email}
                placeholder={user.email ? "Email (cannot be changed)" : "Email (e.g., ahad@example.com)"}
                className={profileErrors.email ? "is-invalid" : ""}
              />
              {profileErrors.email && (
                <div className="invalid-feedback">{profileErrors.email}</div>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="phone" className="fw-semibold body-md-2">
                WhatsApp Number <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={profile.phone}
                disabled
                placeholder="WhatsApp Number (e.g., 03001234567)"
                className={profileErrors.phone ? "is-invalid" : ""}
              />
              {profileErrors.phone && (
                <div className="invalid-feedback">{profileErrors.phone}</div>
              )}
            </fieldset>
          </div>
          <div className="cols mb-3">
             <fieldset>
              <label htmlFor="lastName" className="fw-semibold body-md-2">
                Alternative Number (optional)
              </label>
              <input
                type="text"
                id="alternativePhone"
                value={profile.alternativePhone}
                onChange={handleProfileChange}
                placeholder="Alternative Number (e.g., 03009876543)"
                className={profileErrors.alternativePhone ? "is-invalid" : ""}
              />
              {profileErrors.lastName && (
                <div className="invalid-feedback">{profileErrors.lastName}</div>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="cnic" className="fw-semibold body-md-2">
                CNIC Number <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="cnic"
                value={profile.cnic}
                onChange={!profile.cnic ? handleProfileChange : null}
                disabled={!!profile.cnic}
                placeholder="Enter CNIC if not set"
                className={profileErrors.cnic ? "is-invalid" : ""}
              />
              {profileErrors.cnic && (
                <div className="invalid-feedback">{profileErrors.cnic}</div>
              )}
            </fieldset>
          </div>
          <button type="submit" className="tf-btn btn-large text-white" disabled={profileLoading}>
            {profileLoading ? (
              <div>
                Processing...{" "}
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <span className="text-white">Update Profile</span>
            )}
          </button>
        </form>
      </div>
      <div className="wrap">
        <h4 className="fw-semibold mb-20">Change Password</h4>
        <form onSubmit={handlePasswordSubmit} className="def form-reset-password">
          <fieldset className="position-relative">
            <input
              type={showOldPassword ? "text" : "password"}
              id="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Old Password"
              className={passwordErrors.oldPassword ? "is-invalid" : ""}
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y pe-3"
              onClick={toggleOldPasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {showOldPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="#ff3d3d"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                    fill="#ff3d3d"
                  />
                </svg>
              )}
            </span>
            {passwordErrors.oldPassword && (
              <div className="invalid-feedback">{passwordErrors.oldPassword}</div>
            )}
          </fieldset>
          <fieldset className="position-relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className={passwordErrors.newPassword ? "is-invalid" : ""}
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y pe-3"
              onClick={toggleNewPasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {showNewPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="#ff3d3d"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                    fill="#ff3d3d"
                  />
                </svg>
              )}
            </span>
            {passwordErrors.newPassword && (
              <div className="invalid-feedback">{passwordErrors.newPassword}</div>
            )}
          </fieldset>
          <fieldset className="position-relative">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              id="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm Password"
              className={passwordErrors.confirmNewPassword ? "is-invalid" : ""}
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y pe-3"
              onClick={toggleConfirmNewPasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {showConfirmNewPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="#ff3d3d"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                    fill="#ff3d3d"
                  />
                </svg>
              )}
            </span>
            {passwordErrors.confirmNewPassword && (
              <div className="invalid-feedback">{passwordErrors.confirmNewPassword}</div>
            )}
          </fieldset>
          <div className="box-btn">
            <button type="submit" className="tf-btn btn-large text-white" disabled={passwordLoading}>
              {passwordLoading ? (
                <div>
                  Processing...{" "}
                  <div className="spinner-border spinner-border-sm text-white" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <span className="text-white">Change Password</span>
              )}
            </button>
          </div>
        </form>
        <p className="notice">Please note: Updating your profile or changing your password will log you out. You will need to log in again to continue.</p>
      </div>
    </div>
  );
}