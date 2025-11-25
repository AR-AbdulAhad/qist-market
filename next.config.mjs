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
          source: '/((?!maintenance).*)', 
          
          destination: '/maintenance',
          permanent: false, 
        },
      ];
    }
    
    return [];
  },
};

export default nextConfig;