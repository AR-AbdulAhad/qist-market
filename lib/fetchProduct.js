export async function fetchProduct(slugName) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/product/name/${slugName}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Product not found');
  }

  const product = await res.json();

  if (!product || product.isDeleted || product.isActive === false) {
    throw new Error('Product not found');
  }

  return product;
}