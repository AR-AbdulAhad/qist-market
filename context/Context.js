"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const dataContext = createContext();
export const useContextElement = () => useContext(dataContext);

export default function Context({ children }) {
  // State for cart, wishlist, and quick view
  const [cartProducts, setCartProducts] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);

  // State for modal management
  const [activeModal, setActiveModal] = useState(null);
  const [modalProps, setModalProps] = useState({});

  // Log quickViewItem updates
  useEffect(() => {
    console.log("quickViewItem updated:", quickViewItem);
  }, [quickViewItem]);

  // Dynamically import Bootstrap Modal on the client side
  const [Modal, setModal] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm")
        .then((module) => {
          setModal(() => module.Modal);
        })
        .catch((error) => {
          console.error("Failed to load Bootstrap Modal:", error);
        });
    }
  }, []);

  // Check if a product is in the cart
  const isAddedToCartProducts = (id) => {
    return !!cartProducts.find((elm) => elm.id === id);
  };

  // Add product to cart
  const addProductToCart = (product, qty = 1, isModal = true) => {
    if (!isAddedToCartProducts(product.id)) {
      const item = { ...product, quantity: qty };
      setCartProducts((prev) => [...prev, item]);
      if (isModal && Modal) {
        openModal("cartModal");
      }
    }
  };

  // Modal management
  const closeAllModals = () => {
    if (typeof window !== "undefined" && Modal) {
      const modalElements = document.querySelectorAll(".modal.show");
      modalElements.forEach((modal) => {
        const modalInstance = Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      });
    }
  };

  const openModal = (modalId, props = {}) => {
    if (typeof window !== "undefined" && Modal) {
      console.log("Opening modal:", modalId);
      closeAllModals();
      setModalProps(props);
      setActiveModal(modalId);
    } else {
      console.error("Modal or window is undefined. Cannot open modal:", modalId);
    }
  };

  const closeModal = () => {
    if (typeof window !== "undefined" && activeModal && Modal) {
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
    if (typeof window !== "undefined" && activeModal && Modal) {
      const modalElement = document.getElementById(activeModal);
      if (modalElement) {
        closeAllModals();
        const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
        modalInstance.show();
        const currentId = activeModal;
        const listener = () => {
          if (activeModal === currentId) {
            setActiveModal(null);
            setModalProps({});
          }
        };
        modalElement.addEventListener("hidden.bs.modal", listener);
        return () => {
          modalElement.removeEventListener("hidden.bs.modal", listener);
        };
      } else {
        console.error("Modal element not found for ID:", activeModal);
      }
    }
  }, [activeModal, Modal]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    addProductToCart,
    isAddedToCartProducts,
    quickViewItem,
    setQuickViewItem,
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