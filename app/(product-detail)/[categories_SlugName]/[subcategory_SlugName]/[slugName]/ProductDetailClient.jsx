"use client";

import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Description from "@/components/product-detail/Description";
import React, { useState } from "react";
import Details1 from "@/components/product-detail/Details1";
import Relatedproducts from "@/components/product-detail/Relatedproducts";

export default function ProductDetailClient({ slugName, product }) {
  const [singleProduct] = useState(product);
  const [loading] = useState(false);

  return (
    <>
      <Header4 />
      <Details1 singleProduct={singleProduct} loading={loading} />
      <Description singleProduct={singleProduct} loading={loading} />
      {!loading && singleProduct && singleProduct.subcategory_slug_name && (
        <Relatedproducts
          subcategorySlugName={singleProduct.subcategory_slug_name}
          loading={loading}
        />
      )}
      <Footer1 />
    </>
  );
}