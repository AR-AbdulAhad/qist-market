export async function generateMetadata({ params }) {
  const formatSlugName = (slug) => {
    if (!slug) return "";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return {
    title: `${formatSlugName(params.subCategorySlug)} ${formatSlugName(params.categorySlug)} Price in Pakistan on Installment` || "loading...",
    description: `Browse ${formatSlugName(params.categorySlug)} ${formatSlugName(params.subCategorySlug)} at best prices in Pakistan`,
    robots: "index, follow",
  };
}

import SubCategoryClient from "./SubCategoryClient";

export default function SubCategoryPage({ params }) {
  return <SubCategoryClient categorySlug={params.categorySlug} subCategorySlug={params.subCategorySlug} />;
}
