"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

function WhatsAppBtn() {
  const { settings } = useSettings();

  const phoneNumber = settings?.phone;

  const handleClick = () => {
    if (!phoneNumber) return alert("WhatsApp number not set in settings!");
    const url = `https://wa.me/+92${phoneNumber}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="whatsapp-btn"
      onClick={handleClick}
    >
      <MessageCircle size={28} />
    </div>
  );
}

export default WhatsAppBtn;
