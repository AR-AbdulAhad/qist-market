"use client";

import Context from "@/context/Context";
import "../public/scss/main.scss";
import "@/public/css/global.css";
import "photoswipe/dist/photoswipe.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
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

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
    utm_id: params.get("utm_id") || "",
    utm_source_platform: params.get("utm_source_platform") || "",
    utm_creative_format: params.get("utm_creative_format") || "",
    utm_marketing_tactic: params.get("utm_marketing_tactic") || "",
  };
}

function getReferralSource(referrer) {
  if (!referrer) return "direct";

  if (referrer.includes("google.com")) return "organic_google";
  if (referrer.includes("bing.com")) return "organic_bing";
  if (referrer.includes("yahoo.com")) return "organic_yahoo";
  if (referrer.includes("duckduckgo.com")) return "organic_duckduckgo";

  if (referrer.includes("facebook.com")) return "social_facebook";
  if (referrer.includes("instagram.com")) return "social_instagram";
  if (referrer.includes("twitter.com") || referrer.includes("x.com")) return "social_twitter";
  if (referrer.includes("linkedin.com")) return "social_linkedin";
  if (referrer.includes("youtube.com")) return "social_youtube";
  if (referrer.includes("tiktok.com")) return "social_tiktok";
  if (referrer.includes("pinterest.com")) return "social_pinterest";
  if (referrer.includes("snapchat.com")) return "social_snapchat";
  if (referrer.includes("threads.net")) return "social_threads";
  if (referrer.includes("whatsapp.com")) return "social_whatsapp";

  if (referrer.includes("telegram.org")) return "messenger_telegram";
  if (referrer.includes("discord.com")) return "messenger_discord";
  if (referrer.includes("reddit.com")) return "community_reddit";

  if (referrer.includes("amazon.com")) return "affiliate_amazon";
  if (referrer.includes("ebay.com")) return "affiliate_ebay";

  return "other_" + new URL(referrer).hostname;
}

export default function RootLayout({ children, footerScripts }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingSource = Cookies.get("referralSource");
      if (!existingSource) {
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
        Cookies.set("referralSource", JSON.stringify(source), { expires: 7 });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm");
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
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then((bootstrap) => {
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
      });
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/utlis/wow").then((WOWModule) => {
        const WOW = WOWModule.default;
        const wow = new WOW({
          mobile: false,
          live: false,
        });
        wow.init();
      });
    }
  }, [pathname]);

  return (
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
            <Toolbar />
            <Search />
            <AddParallax />
            <ToastContainer />
          </Context>
        </AuthProvider>
      </SettingsProvider>
    </div>
  );
}