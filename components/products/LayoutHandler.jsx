"use client";

import { useEffect, useState, useRef } from "react";

export default function LayoutHandler({ loading, hasProducts }) {
  const [currentLayout, setCurrentLayout] = useState("tabgrid-2"); // Default layout
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (loading || !hasProducts) {
      return;
    }

    const handleClick = (e, isDefaultTrigger = false) => {
      e.preventDefault();

      const viewSwitch = e.currentTarget;
      const tabClass = viewSwitch.dataset.tab;
      setCurrentLayout(tabClass); // Update state with selected layout

      const gridLayout = document.querySelector(".tf-grid-layout");
      const gridLayoutWrapper = document.querySelector(".gridLayout-wrapper");
      const cardProducts = document.querySelectorAll(".tf-grid-layout .card-product");

      if (!gridLayoutWrapper || !gridLayout) {
        console.warn("gridLayoutWrapper or gridLayout not found in the DOM");
        return;
      }

      if (!isDefaultTrigger) {
        gridLayoutWrapper.classList.add("loading");
        gridLayout.classList.add("d-none");
      }

      setTimeout(
        () => {
          const layoutClasses = Array.from(gridLayout.classList).filter(
            (className) => className.startsWith("layout-")
          );
          layoutClasses.forEach((className) => gridLayout.classList.remove(className));

          gridLayout.classList.add(`layout-${tabClass}`);

          document
            .querySelectorAll(".tf-view-layout-switch")
            .forEach((switchEl) => {
              switchEl.classList.remove("active");
            });
          viewSwitch.classList.add("active");

          cardProducts.forEach((card) => {
            card.className = "card-product";

            if (tabClass === "tablist-1") {
              card.classList.add("style-row");
            } else if (tabClass === "tablist-2") {
              card.classList.add("style-row", "type-row-2", "row-small", "flex-sm-row");
            }
          });

          gridLayoutWrapper.classList.remove("loading");
          gridLayout.classList.remove("d-none");
        },
        isDefaultTrigger ? 0 : 300
      );
    };

    const switches = document.querySelectorAll(".tf-view-layout-switch");
    switches.forEach((switchEl) => {
      switchEl.addEventListener("click", (e) => handleClick(e, false));
    });

    if (isInitialRender.current) {
      const defaultTab = document.querySelector(`[data-tab="${currentLayout}"]`);
      if (defaultTab) {
        defaultTab.classList.add("active");
        defaultTab.querySelector(".tab-link").classList.add("active");
        const event = new Event("click");
        handleClick({ currentTarget: defaultTab, preventDefault: () => {} }, true);
      }
      isInitialRender.current = false;
    }

    return () => {
      switches.forEach((switchEl) => {
        switchEl.removeEventListener("click", (e) => handleClick(e, false));
      });
    };
  }, [loading, hasProducts]);

  // Re-apply layout when filters or sorting change
  useEffect(() => {
    if (!loading && hasProducts) {
      const gridLayout = document.querySelector(".tf-grid-layout");
      const gridLayoutWrapper = document.querySelector(".gridLayout-wrapper");
      const cardProducts = document.querySelectorAll(".tf-grid-layout .card-product");

      if (!gridLayoutWrapper || !gridLayout) {
        return;
      }

      const layoutClasses = Array.from(gridLayout.classList).filter(
        (className) => className.startsWith("layout-")
      );
      layoutClasses.forEach((className) => gridLayout.classList.remove(className));

      gridLayout.classList.add(`layout-${currentLayout}`);

      document.querySelectorAll(".tf-view-layout-switch").forEach((switchEl) => {
        switchEl.classList.remove("active");
        if (switchEl.dataset.tab === currentLayout) {
          switchEl.classList.add("active");
          switchEl.querySelector(".tab-link").classList.add("active");
        }
      });

      cardProducts.forEach((card) => {
        card.className = "card-product";
        if (currentLayout === "tablist-1") {
          card.classList.add("style-row");
        } else if (currentLayout === "tablist-2") {
          card.classList.add("style-row", "type-row-2", "row-small", "flex-sm-row");
        }
      });
    }
  }, [loading, hasProducts, currentLayout]);

  return (
    <ul className="tf-control-layout menu-tab-line" role="tablist">
      <li className={`tf-view-layout-switch ${currentLayout === "tabgrid-2" ? "active" : ""}`} data-tab="tabgrid-2">
        <a
          href="#"
          className={`tab-link main-title link d-flex fw-semibold ${currentLayout === "tabgrid-2" ? "active" : ""}`}
          data-bs-toggle="tab"
        >
          <i className="icon-dot-line" />
        </a>
      </li>
      <li className={`tf-view-layout-switch ${currentLayout === "tablist-1" ? "active" : ""}`} data-tab="tablist-1">
        <a
          href="#"
          className={`tab-link main-title link d-flex fw-semibold ${currentLayout === "tablist-1" ? "active" : ""}`}
          data-bs-toggle="tab"
        >
          <i className="icon-list-1" />
        </a>
      </li>
    </ul>
  );
}