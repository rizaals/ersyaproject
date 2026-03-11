/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Unsplash (dummy thumbnails)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Fallback untuk gambar eksternal
      { protocol: 'https', hostname: '*.landingforge.id' },
    ],
  },
  // Transpile GrapesJS (menggunakan ES module)
  transpilePackages: ['grapesjs', 'grapesjs-preset-webpage', 'grapesjs-preset-newsletter'],
}

export default nextConfig
