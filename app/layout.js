"use client";
import Context from "@/context/Context";
import "../public/scss/main.scss";
import "@/public/css/global.css";
import "photoswipe/dist/photoswipe.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie
import Cart from "@/components/modals/Cart";
import Login from "@/components/modals/Login";
import Register from "@/components/modals/Register";
import ScrollTop from "@/components/common/ScrollTop";
import Quickview from "@/components/modals/Quickview";
import MobileMenu from "@/components/modals/MobileMenu";
import Toolbar from "@/components/modals/Toolbar";
import Search from "@/components/modals/Search";
import AddParallax from "@/utlis/AddParallax";
import 'react-loading-skeleton/dist/skeleton.css';
import ForgotPassword from "@/components/modals/ForgotPassword";
import VerificationCode from "@/components/modals/VerificationCode";
import ChangePassword from "@/components/modals/ChangePassword";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
// import WhatsAppBtn from "@/components/common/WhatsAppBtn";

// Function to parse UTM parameters from URL
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    // Add more UTM params if needed (e.g., utm_term, utm_content)
  };
}

// Function to determine source if no UTM
function getReferralSource(referrer) {
  if (!referrer) return "direct";
  if (referrer.includes("google.com")) return "organic_google";
  if (referrer.includes("facebook.com")) return "social_facebook";
  if (referrer.includes("bing.com")) return "organic_bing";
  // Add more rules as needed for other sources
  return "other_" + new URL(referrer).hostname;
}

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Referral source tracking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingSource = Cookies.get("referralSource");
      if (!existingSource) { // Only set if not already present
        const utm = getUTMParams();
        let source;
        if (utm.utm_source) {
          source = {
            type: "ad_or_campaign",
            details: utm,
          };
        } else {
          const referrer = document.referrer || "";
          source = {
            type: getReferralSource(referrer),
            details: { referrer },
          };
        }
        Cookies.set("referralSource", JSON.stringify(source), { expires: 7 }); // Expires in 7 days
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => {});
    }
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;
    const delta = 5;
    let navbarHeight = 0;
    let didScroll = false;
    const header = document.querySelector("header");

    const handleScroll = () => {
      didScroll = true;
    };

    const checkScroll = () => {
      if (didScroll && header) {
        const st = window.scrollY || document.documentElement.scrollTop;
        navbarHeight = header.offsetHeight;

        if (st > navbarHeight) {
          if (st > lastScrollTop + delta) {
            header.style.top = `-${navbarHeight}px`;
          } else if (st < lastScrollTop - delta) {
            header.style.top = "0";
            header.classList.add("header-bg");
          }
        } else {
          header.style.top = "";
          header.classList.remove("header-bg");
        }

        lastScrollTop = st;
        didScroll = false;
      }
    };

    if (header) {
      navbarHeight = header.offsetHeight;
    }

    window.addEventListener("scroll", handleScroll);
    const scrollInterval = setInterval(checkScroll, 250);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(scrollInterval);
    };
  }, [pathname]);

  useEffect(() => {
    const bootstrap = require("bootstrap");
    const modalElements = document.querySelectorAll(".modal.show");
    modalElements.forEach((modal) => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    });

    const offcanvasElements = document.querySelectorAll(".offcanvas.show");
    offcanvasElements.forEach((offcanvas) => {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    });
  }, [pathname]);

  useEffect(() => {
    const WOW = require("@/utlis/wow");
    const wow = new WOW.default({
      mobile: false,
      live: false,
    });
    wow.init();
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/helvetica-neue-55"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="wrapper">
          <SettingsProvider>
            <AuthProvider>
              <Context>
                {children}
                <Login />
                <Register />
                <ForgotPassword />
                <VerificationCode />
                <ChangePassword />
                <Cart />
                <Quickview />
                <MobileMenu />
                <ScrollTop />
                {/* <WhatsAppBtn /> */}
                <Toolbar />
                <Search />
                <AddParallax />
                <ToastContainer />
              </Context>
            </AuthProvider>
          </SettingsProvider>
        </div>
      </body>
    </html>
  );
}