"use client";

import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import React, { useEffect, useState } from "react";
import BlogsDetails from "@/components/otherPages/BlogsDetails";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function BlogDetailClient({ slugName }) {
  const [singleBlog, setSingleBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/blogs/slug/${slugName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to fetch blog');
        }

        const data = await response.json();
        setSingleBlog(data);
      } catch (error) {
        console.error(error.message === 'Unauthorized' ? 'Please log in to access blogs' : 'Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };
    fetchSingleBlog();
  }, [slugName]);

  return (
    <>
      <Header4 />
      <BlogsDetails singleBlog={singleBlog} loading={loading} />
      <Footer1 />
    </>
  );
}