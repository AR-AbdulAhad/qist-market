export async function generateMetadata({ params }) {
  const slug = params.categorySlug;
  const formatted = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formatted} Price in Pakistan on Installment` || "loading...",
    description: `Browse ${formatted} at best prices in Pakistan`,
    robots: "index, follow",
  };
}

import CategoryClient from "./CategoryClient";

export default function CategoryPage({ params }) {
  return <CategoryClient categorySlug={params.categorySlug} />;
}
