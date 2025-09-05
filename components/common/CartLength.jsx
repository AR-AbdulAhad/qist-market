"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function CartLength() {
  const [cartLength, setCartLength] = useState(0);

  const updateCartLength = () => {
    try {
      const data = Cookies.get("cartData");
      setCartLength(data ? 1 : 0);
    } catch (error) {
      console.error("Error reading cartData cookie:", error);
      setCartLength(0);
    }
  };

  useEffect(() => {
    updateCartLength();

    const intervalId = setInterval(() => {
      updateCartLength();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <>{cartLength}</>;
}