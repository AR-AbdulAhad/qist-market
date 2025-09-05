"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { recentPosts } from "@/data/blogs";
import ShowAllCategories from "../products/ShowAllCategories";
export default function Sidebar() {
  return (
    <div className="blog-sidebar d-xl-flex d-none sidebar-content-wrap">
      <ShowAllCategories />
      <div className="sidebar-item has-line-bt">
        <h6 className="sb-title fw-semibold">Recent posts</h6>
        <ul className="sb-content sb-recent">
          {recentPosts.map((post, index) => (
            <li className="hover-img" key={index}>
              <Link href={`/blog-detail`} className="image img-style">
                <Image
                  src={post.imgSrc}
                  alt=""
                  className="lazyload"
                  width={224}
                  height={148}
                />
              </Link>
              <div className="content">
                <Link
                  href={`/blog-detail`}
                  className="body-md-2 fw-semibold link"
                >
                  {post.title}
                </Link>
                <p className="date">
                  <Image
                    alt=""
                    src="/images/clock.svg"
                    width={16}
                    height={17}
                  />
                  <span className="body-small"> {post.date} </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-item type-space-2">
        <h6 className="sb-title fw-semibold">Tags</h6>
        <ul className="sb-content sb-tags">
          <li>
            <a href="#" className="body-text-3">
              ThemeMu
            </a>
          </li>
          <li>
            <a href="#" className="body-text-3">
              Busines plans
            </a>
          </li>
          <li>
            <a href="#" className="body-text-3">
              Middle
            </a>
          </li>
          <li>
            <a href="#" className="body-text-3">
              Web design
            </a>
          </li>
          <li>
            <a href="#" className="body-text-3">
              App
            </a>
          </li>
          <li>
            <a href="#" className="body-text-3">
              Case study
            </a>
          </li>
          <li>
            <a href="#" className="body-text-3">
              Psychological
            </a>
          </li>
          <li>
            <a href="#" className="body-text-3">
              Pricing
            </a>
          </li>
          <li>
            <a href="#" className="body-text-3">
              Methods
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
