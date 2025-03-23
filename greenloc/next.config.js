/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'avatars.githubusercontent.com',
            'lh3.googleusercontent.com',
            'res.cloudinary.com',
        ]
    }
}
const securityHeaders = [
    {
      key: "Content-Security-Policy",
      value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; object-src 'none'"
    }
  ];
  
  module.exports = {
    async headers() {
      return [{ source: "/(.*)", headers: securityHeaders }];
    },
  };

module.exports = nextConfig
