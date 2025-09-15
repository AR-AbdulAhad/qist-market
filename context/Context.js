"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { allProducts } from "@/data/products";
import { Modal } from "bootstrap";

const dataContext = createContext();
export const useContextElement = () => useContext(dataContext);

export default function Context({ children }) {
  // Existing state for cart, wishlist, and compare
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([1, 2, 3]);
  const [compareItem, setCompareItem] = useState([1, 2, 3, 4]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // State for modal management
  const [activeModal, setActiveModal] = useState(null);
  const [modalProps, setModalProps] = useState({});

  // Existing cart-related logic
  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (id) => {
    return !!cartProducts.find((elm) => elm.id === id);
  };

  const addProductToCart = (id, qty, isModal = true) => {
    if (!isAddedToCartProducts(id)) {
      const item = { ...allProducts.find((elm) => elm.id === id), quantity: qty || 1 };
      setCartProducts((prev) => [...prev, item]);
      if (isModal) {
        // openCartModal(); // Uncomment if you have this function
      }
    }
  };

  const updateQuantity = (id, qty) => {
    if (isAddedToCartProducts(id) && qty >= 1) {
      setCartProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
    }
  };

  const addToWishlist = (id) => {
    if (!wishList.includes(id)) {
      setWishList((prev) => [...prev, id]);
      // openWishlistModal(); // Uncomment if you have this function
    } else {
      setWishList((prev) => prev.filter((elm) => elm !== id));
    }
  };

  const removeFromWishlist = (id) => {
    setWishList((prev) => prev.filter((elm) => elm !== id));
  };

  const addToCompareItem = (id) => {
    if (!compareItem.includes(id)) {
      setCompareItem((prev) => [...prev, id]);
    }
  };

  const removeFromCompareItem = (id) => {
    setCompareItem((prev) => prev.filter((elm) => elm !== id));
  };

  const isAddedtoWishlist = (id) => wishList.includes(id);
  const isAddedtoCompareItem = (id) => compareItem.includes(id);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) setCartProducts(items);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) setWishList(items);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  // Modal management
  const closeAllModals = () => {
    const modalElements = document.querySelectorAll(".modal.show");
    modalElements.forEach((modal) => {
      const modalInstance = Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    });
  };

  const openModal = (modalId, props = {}) => {
    // Close all open modals
    closeAllModals();
    // Set new modal state
    setModalProps(props);
    setActiveModal(modalId);
  };

  const closeModal = () => {
    if (activeModal) {
      const modalElement = document.getElementById(activeModal);
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
        modalInstance.hide();
      }
      setActiveModal(null);
      setModalProps({});
    }
  };

  useEffect(() => {
    if (activeModal) {
      const modalElement = document.getElementById(activeModal);
      if (modalElement) {
        closeAllModals();
        const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
        modalInstance.show();
        const currentId = activeModal; // Capture the current modal ID
        const listener = () => {
          if (activeModal === currentId) { // Only clear if this is still the active modal
            setActiveModal(null);
            setModalProps({});
          }
        };
        modalElement.addEventListener("hidden.bs.modal", listener);
        // Cleanup listener on unmount or re-run
        return () => {
          modalElement.removeEventListener("hidden.bs.modal", listener);
        };
      }
    }
  }, [activeModal]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
    openModal,
    closeModal,
    modalProps,
  };

  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}