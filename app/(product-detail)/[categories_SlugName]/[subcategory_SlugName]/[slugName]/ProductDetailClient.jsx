"use client";

import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
// import Description from "@/components/product-detail/Description";
// import Details1 from "@/components/product-detail/Details1";
// import Relatedproducts from "@/components/product-detail/Relatedproducts";

export default function ProductDetailClient({ product }) {
  return (
    <>
      <Header4 />
      {/* <Details1 singleProduct={product} loading={false} /> */}
      {/* <Description singleProduct={product} loading={false} />
      {product?.subcategory_slug_name && (
        <Relatedproducts subcategorySlugName={product.subcategory_slug_name} loading={false} />
      )} */}
      <h1>Test</h1>
      <Footer1 />
    </>
  );
}