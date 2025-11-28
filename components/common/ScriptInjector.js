"use client";

import { useEffect } from "react";

export default function ScriptInjector({ scripts, position = "head" }) {
  useEffect(() => {
    if (!scripts || scripts.length === 0) return;

    const target = position === "head" ? document.head : document.body;

    scripts.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = item.script.trim();

      wrapper.querySelectorAll("meta, link, title").forEach((el) => {
        const existing = target.querySelector(
          `${el.tagName}[name="${el.name}"], ${el.tagName}[property="${el.property}"], ${el.tagName}[href="${el.href}"]`
        );
        if (!existing) {
          target.appendChild(el.cloneNode(true));
        }
      });

      wrapper.querySelectorAll("script").forEach((oldScript) => {
        const newScript = document.createElement("script");

        [...oldScript.attributes].forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        newScript.innerHTML = oldScript.innerHTML;

        const existingScript = target.querySelector(`script[src="${oldScript.src}"]`);
        if (existingScript) {
          existingScript.replaceWith(newScript);
        } else {
          target.appendChild(newScript);
        }
      });

      wrapper.querySelectorAll("noscript").forEach((ns) => {
        target.insertAdjacentHTML("beforeend", ns.outerHTML);
      });
    });
  }, [scripts, position]);

  return null;
}