"use client";

import { useEffect } from "react";

export default function ScriptInjector({ scripts, position = "head" }) {
  useEffect(() => {
    if (!scripts || scripts.length === 0) return;

    scripts.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = item.script;

      wrapper.querySelectorAll("script").forEach((oldScript) => {
        const newScript = document.createElement("script");

        [...oldScript.attributes].forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        newScript.innerHTML = oldScript.innerHTML;

        if (position === "head") {
          document.head.appendChild(newScript);
        } else {
          document.body.appendChild(newScript);
        }
      });
      
      wrapper.querySelectorAll("noscript").forEach((ns) => {
        if (position === "head") {
          document.head.insertAdjacentHTML("beforeend", ns.outerHTML);
        } else {
          document.body.insertAdjacentHTML("beforeend", ns.outerHTML);
        }
      });
    });
  }, [scripts]);

  return null;
}
