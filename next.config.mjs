/** @type {import('next').NextConfig} */
const IS_MAINTENANCE_MODE = true; 

const nextConfig = {
  images: {
    unoptimized: true,
  },

  async redirects() {
    if (IS_MAINTENANCE_MODE) {
      return [
        {
          source: '/((?!maintenance|home_sitemap\\.xml|categories_sitemap\\.xml|subcategories_sitemap\\.xml|products_sitemap\\.xml|products_tags_sitemap\\.xml|sitemap\\.xml|robots\\.txt).*)',
          
          destination: '/maintenance',
          
          permanent: false, 
        },
      ];
    }
    
    return [];
  },
};

export default nextConfig;