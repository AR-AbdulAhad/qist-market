'use client';

import RecentProducts from "@/components/common/RecentProducts";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Description from "@/components/product-detail/Description";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Details1 from "@/components/product-detail/Details1";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ProductDetailPage() {
  const { slugName } =  useParams();
  const [singleProduct, setSingleProduct] = useState([]);
  const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchSingleProduct = async () => {
          try {
            setLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/product/name/${slugName}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            if (!response.ok) {
              throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to fetch products');
            }
    
            const data = await response.json();
            setSingleProduct(data);
          } catch (error) {
            console.error(error.message === 'Unauthorized' ? 'Please log in to access products' : 'Failed to fetch products');
          } finally {
            setLoading(false);
          }
        };
        fetchSingleProduct();
      }, []);

  return (
    <>
      <Header4 />
      <Details1 singleProduct={singleProduct} loading={loading} />
      <Description singleProduct={singleProduct} loading={loading} />
      <RecentProducts />
      <Footer1 />
    </>
  );
}
